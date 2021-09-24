/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {
  ModelGetParams,
  ModelJoin,
  ModelListParams,
  ModelListResult,
  ModelQueryParams,
  ModelQuerySelector,
  ModelSort
} from '@gngt/core/common';
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import {
  BehaviorSubject,
  from,
  Observable,
  of as obsOf,
  Subscription,
  throwError,
  timer,
  zip
} from 'rxjs';
import {
  catchError,
  concatMap,
  delayWhen,
  exhaustMap,
  filter,
  map,
  mapTo,
  switchMap,
  take,
  tap,
  toArray
} from 'rxjs/operators';

import {LocalDoc} from './local-doc';
import {LocalSyncEntry} from './local-sync-entry';
import {LocalSyncNumber} from './local-sync-number';
import {SyncCheckpoint} from './sync-checkpoint';
import {SyncEntry} from './sync-entry';
import {SYNC_OPTIONS, SyncOptions} from './sync-options';
import {SyncStatus} from './sync-status';
import {registerSyncModel} from './sync-utils';
import {UpwardChange} from './upward-change';
import {UpwardChangeResult} from './upward-change-result';

type DatabaseContent = LocalDoc<any>|LocalSyncEntry|LocalSyncNumber|SyncCheckpoint;

const pouchDBStatic: PouchDB.Static = (<any>PouchDB).default || PouchDB;
const pouchDBFindPlugin: PouchDB.Plugin = (<any>PouchDBFind).default || PouchDBFind;

@Injectable()
export class SyncService {
  private _status: BehaviorSubject<SyncStatus> =
      new BehaviorSubject<SyncStatus>({status: 'initializing'});
  readonly status: Observable<SyncStatus> = this._status as Observable<SyncStatus>;

  private _timerSub: Subscription = Subscription.EMPTY;
  private _syncing = false;
  private _database: PouchDB.Database<DatabaseContent>;
  private readonly _remoteCheckpointKey = 'gngt_remote_sync_checkpoint';
  private readonly _localCheckpointKey = 'gngt_local_sync_checkpoint';
  private readonly _localSyncNumber = 'gngt_local_sync_number';
  private readonly _localSyncEntryPrefix = 'gngt_local_sync_entry_';
  private readonly _syncUrl: string;
  private readonly _changesUrl: string;
  private readonly _relationalModelIdx: PouchDB.Find.CreateIndexOptions = {
    index: {name: 'relational_model_idx', fields: ['table_name', 'object_id']}
  };
  private readonly _databaseInit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _databaseIsInit: Observable<boolean>;

  constructor(@Inject(SYNC_OPTIONS) private _opts: SyncOptions, private _httpClient: HttpClient) {
    if (this._opts.syncInterval == null) {
      this._opts.syncInterval = 300000;
    }
    if (this._opts.changesBatchSize == null) {
      this._opts.changesBatchSize = 50;
    }

    this._syncUrl = `${this._opts.baseUrl}${this._opts.changesPath || 'changes'}`;
    this._changesUrl = `${this._opts.baseUrl}${this._opts.docsPath || 'docs'}`;
    this._initLocalDatabase();
    this._databaseIsInit = this._databaseInit.pipe(filter(i => i));
  }

  registerSyncModel(endPoint: string, tableName: string): void {
    registerSyncModel(endPoint, tableName);
  }

  start(immediate = true): void {
    if (this._syncing) {
      return;
    }
    this._syncing = true;
    this._timerSub = timer(immediate ? 0 : this._opts.syncInterval, this._opts.syncInterval)
                         .pipe(
                             delayWhen(_ => this._databaseIsInit),
                             )
                         .subscribe(_ => this._checkSync());
  }

  stop(): void {
    if (!this._syncing) {
      return;
    }
    this._timerSub.unsubscribe();
    this._syncing = false;
  }

  get(tableName: string, params: ModelGetParams): Observable<any> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        exhaustMap(_ => this._relationalModelIdxObs()),
        exhaustMap(rmi => {
          const findPromise = db.find(this._modelGetFindRequest(
              tableName, params, rmi as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>));
          return from(findPromise)
              .pipe(
                  take(1),
                  map(res => ({res, rmi})),
              );
        }),
        switchMap(r => {
          const {res, rmi} = r as {
            res: PouchDB.Find.FindResponse<LocalDoc<any>>,
            rmi: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>
          };
          if (res.docs.length === 1) {
            let obj = this._subObject(res.docs[0].object, params.fields);
            if (params.joins != null) {
              const observables = params.joins.map(join => {
                const findPromise = db.find(this._modelGetFindRequest(
                    join.model, {id: obj[join.property], fields: join.fields}, rmi));
                return from(findPromise)
                    .pipe(
                        take(1),
                        map(relRes => {
                          const related = relRes as PouchDB.Find.FindResponse<LocalDoc<any>>;
                          return related.docs.length === 1 ? related.docs[0].object : null;
                        }),
                        map(related => ({join, related})),
                    );
              });
              return zip(...observables)
                  .pipe(
                      map(joins => {
                        joins.forEach(joinEntry => {
                          obj[joinEntry.join.property] = joinEntry.related;
                        });
                        return obj;
                      }),
                  );
            }
            return obsOf(obj);
          }
          return throwError('not_found');
        }),
        take(1),
    );
  }

  list(tableName: string, params: ModelListParams): Observable<ModelListResult<any>> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        exhaustMap(_ => this._relationalModelIdxObs({tableName, sort: params.sort})),
        exhaustMap(idx => {
          let findReq = this._modelListFindRequest(
              tableName, params, idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>);
          return from(db.find(findReq))
              .pipe(
                  take(1),
                  catchError(err => {
                    if (err.error === 'no_usable_index') {
                      delete findReq.use_index;
                      delete findReq.sort;
                      return from(db.find(findReq)).pipe(take(1));
                    }
                    return throwError(err);
                  }),
              );
        }),
        switchMap(
            res => this._relationalModelIdxObs().pipe(
                map(idx => ({res, idx})),
                )),
        switchMap(curRes => {
          const {res, idx} = curRes as {
            res: PouchDB.Find.FindResponse<LocalDoc<any>>,
            idx: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>
          };
          if (params.joins != null) {
            const joinTables: {[table: string]: number[]} = params.joins.reduce((prev, cur) => {
              const fk = cur.foreignKey || cur.property;
              prev[cur.model] = res.docs.map(d => d.object[fk]);
              return prev;
            }, {} as {[table: string]: number[]});
            return zip(...params.joins.map(join => {
                     const joinModel = join.offlineModel || join.model;
                     const req = this._modelListFindRequest(joinModel, {fields: join.fields}, idx);
                     req.selector['object_id'] = {'$in': joinTables[join.model]};
                     return from(db.find(req))
                         .pipe(
                             take(1),
                             map(related => ({
                                   join,
                                   related:
                                       (related as PouchDB.Find.FindResponse<LocalDoc<any>>).docs
                                 })),
                         );
                   }))
                .pipe(
                    map(joins => {
                      return res.docs.map(doc => {
                        const obj = doc.object;
                        const joinsObj = (joins as {
                                           join: ModelJoin;
                                           related: PouchDB.Core.ExistingDocument<LocalDoc<any>>[];
                                         }[]).reduce((jo, joinEntry) => {
                          const prop = joinEntry.join.property;
                          const fk = joinEntry.join.foreignKey || joinEntry.join.property;
                          const rel = joinEntry.related.find(r => r.object_id === obj[fk]);
                          jo[prop] = rel != null ? rel.object : null;
                          return jo;
                        }, {} as any);
                        return {...this._subObject(obj, params.fields), ...joinsObj};
                      });
                    }),
                );
          }
          return obsOf(res.docs.map(d => this._subObject(d.object, params.fields)));
        }),
        map(r => {
          const results = r as any[];
          return {
            count: results.length,
            results,
            previous: null,
            next: null,
          };
        }),
        take(1),
    );
  }

  create(tableName: string, object: any): Observable<any> {
    return this._databaseIsInit.pipe(
        exhaustMap(_ => this._nextObjectId(tableName).pipe(take(1))),
        exhaustMap(id => {
          object = {id, ...object};
          const localDoc = {table_name: tableName, object_id: id};
          return from(this._database.post({...localDoc, object} as any))
                     .pipe(
                         exhaustMap(d => {
                           const doc = d as PouchDB.Core.Response;
                           return this
                               ._createLocalSyncEntry(
                                   {doc_id: doc.id, entry_type: 'insert', ...localDoc} as
                                   Partial<LocalSyncEntry>)
                               .pipe(
                                   map(() => object),
                               );
                         }),
                         ) as Observable<any>;
        }),
        take(1),
    );
  }

  update(tableName: string, id: number, object: any): Observable<any> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        switchMap(_ => this._relationalModelIdxObs()),
        exhaustMap(
            idx =>
                from(db.find(this._modelGetFindRequest(
                         tableName, {id}, idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>)))
                    .pipe(
                        take(1),
                        )),
        exhaustMap(curRes => {
          const res = curRes as PouchDB.Find.FindResponse<LocalDoc<any>>;
          if (res.docs.length !== 1) {
            return throwError('not_found');
          }
          const localDoc = {...res.docs[0], object};
          return from(db.post(localDoc))
              .pipe(
                  map(r => ({res: r, localDoc})),
                  take(1),
              );
        }),
        exhaustMap(r => {
          const {res, localDoc} = r as
              {res: PouchDB.Core.Response, localDoc: PouchDB.Core.ExistingDocument<LocalDoc<any>>};
          const syncEntry: Partial<LocalSyncEntry> = {
            doc_id: res.id,
            table_name: tableName,
            object_id: localDoc.object_id,
            entry_type: 'update'
          };
          return this._createLocalSyncEntry(syncEntry).pipe(
              map(() => localDoc.object),
              take(1),
          );
        }),
        take(1),
    );
  }

  delete(tableName: string, id: number): Observable<any> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        switchMap(_ => this._relationalModelIdxObs()),
        exhaustMap(
            idx =>
                from(db.find(this._modelGetFindRequest(
                         tableName, {id}, idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>)))
                    .pipe(
                        take(1),
                        )),
        exhaustMap(curRes => {
          const res = curRes as PouchDB.Find.FindResponse<LocalDoc<any>>;
          if (res.docs.length !== 1) {
            return throwError('not_found');
          }
          const localDoc = res.docs[0];
          return from(db.remove(localDoc))
              .pipe(
                  map(r => ({res: r, localDoc})),
                  take(1),
              );
        }),
        exhaustMap(r => {
          const {res, localDoc} = r as
              {res: PouchDB.Core.Response, localDoc: PouchDB.Core.ExistingDocument<LocalDoc<any>>};
          const syncEntry: Partial<LocalSyncEntry> = {
            doc_id: res.id,
            table_name: tableName,
            object_id: localDoc.object_id,
            entry_type: 'delete'
          };
          return this._createLocalSyncEntry(syncEntry).pipe(
              map(() => localDoc.object),
              take(1),
          );
        }),
        take(1),
    );
  }

  deleteAll(tableName: string, ids: number[]): Observable<any[]> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        switchMap(_ => this._relationalModelIdxObs()),
        exhaustMap(
            idx =>
                from(db.find(this._modelBulkIdsFindRequest(
                         tableName, ids, idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>)))
                    .pipe(
                        take(1),
                        )),
        concatMap(r => {
          const res = r as PouchDB.Find.FindResponse<LocalDoc<any>>;
          if (res.docs.length !== 1) {
            return throwError('not_found') as
                Observable<PouchDB.Core.ExistingDocument<LocalDoc<any>>>;
          }
          return from(res.docs) as Observable<PouchDB.Core.ExistingDocument<LocalDoc<any>>>;
        }),
        concatMap(ld => {
          const localDoc = ld as PouchDB.Core.ExistingDocument<LocalDoc<any>>;
          return from(db.remove(localDoc))
              .pipe(
                  map(res => ({res, localDoc})),
              );
        }),
        concatMap(r => {
          const {res, localDoc} = r as
              {res: PouchDB.Core.Response, localDoc: PouchDB.Core.ExistingDocument<LocalDoc<any>>};
          const syncEntry: Partial<LocalSyncEntry> = {
            doc_id: res.id,
            table_name: tableName,
            object_id: localDoc.object_id,
            entry_type: 'delete'
          };
          return this._createLocalSyncEntry(syncEntry).pipe(
              map(() => localDoc.object),
          );
        }),
        take(ids.length),
        toArray(),
    );
  }

  query(tableName: string, params: ModelQueryParams): Observable<ModelListResult<any>> {
    const db = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
               exhaustMap(
                   _ => (this._relationalModelIdxObs(
                             {tableName, selector: params.selector, sort: params.sort}) as
                         Observable<PouchDB.Find.CreateIndexResponse<LocalDoc<any>>>)
                            .pipe(
                                take(1),
                                )),
               exhaustMap(idx => {
                 let findReq = this._modelQueryFindRequest(
                     tableName, params, idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>);
                 return (from(db.find(findReq)) as
                         Observable<PouchDB.Find.FindResponse<LocalDoc<any>>>)
                            .pipe(
                                take(1),
                                catchError(err => {
                                  if (err.error === 'no_usable_index') {
                                    delete findReq.use_index;
                                    delete findReq.sort;
                                    return from(db.find(findReq)).pipe(take(1));
                                  }
                                  return throwError(err);
                                }),
                                ) as Observable<PouchDB.Find.FindResponse<LocalDoc<any>>>;
               }),
               switchMap(r => {
                 const res = r as PouchDB.Find.FindResponse<LocalDoc<any>>;
                 return (this._relationalModelIdxObs() as
                         Observable<PouchDB.Find.CreateIndexResponse<LocalDoc<any>>>)
                     .pipe(
                         map(idx => ({res, idx})),
                     );
               }),
               switchMap(curRes => {
                 const {res, idx} = curRes as {
                   res: PouchDB.Find.FindResponse<LocalDoc<any>>,
                   idx: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>
                 };
                 if (params.joins != null) {
                   const joinTables: {[table: string]: number[]} =
                       params.joins.reduce((prev, cur) => {
                         const fk = cur.foreignKey || cur.property;
                         prev[cur.model] = res.docs.map(d => d.object[fk]);
                         return prev;
                       }, {} as {[table: string]: number[]});
                   return zip(...params.joins.map(join => {
                            const joinModel = join.offlineModel || join.model;
                            const req =
                                this._modelListFindRequest(joinModel, {fields: join.fields}, idx);
                            req.selector['object_id'] = {'$in': joinTables[join.model]};
                            return from(db.find(req))
                                .pipe(
                                    map(related => ({
                                          join,
                                          related:
                                              (related as PouchDB.Find.FindResponse<LocalDoc<any>>)
                                                  .docs
                                        })),
                                    take(1),
                                );
                          }))
                       .pipe(
                           map(joins => {
                             return res.docs.map(doc => {
                               const obj = doc.object;
                               const joinsObj =
                                   (joins as {
                                     join: ModelJoin;
                                     related: PouchDB.Core.ExistingDocument<LocalDoc<any>>[];
                                   }[]).reduce((jo, joinEntry) => {
                                     const prop = joinEntry.join.property;
                                     const fk =
                                         joinEntry.join.foreignKey || joinEntry.join.property;
                                     const rel =
                                         joinEntry.related.find(r => r.object_id === obj[fk]);
                                     jo[prop] = rel != null ? rel.object : null;
                                     return jo;
                                   }, {} as any);
                               return {...this._subObject(obj, params.fields), ...joinsObj};
                             });
                           }),
                       );
                 }
                 return obsOf(res.docs.map(d => this._subObject(d.object, params.fields)));
               }),
               map(results => ({
                     count: (results as any[]).length,
                     results,
                     previous: null,
                     next: null,
                   })),
               take(1),
               ) as Observable<ModelListResult<any>>;
  }

  private _getLocalDocsDb(): PouchDB.Database<LocalDoc<any>> {
    return this._database as PouchDB.Database<LocalDoc<any>>;
  }

  private _getLocalSyncDb(): PouchDB.Database<LocalSyncEntry> {
    return this._database as PouchDB.Database<LocalSyncEntry>;
  }

  private _getLocalSyncNumberDb(): PouchDB.Database<LocalSyncNumber> {
    return this._database as PouchDB.Database<LocalSyncNumber>;
  }

  private _getSyncCheckpointDb(): PouchDB.Database<SyncCheckpoint> {
    return this._database as PouchDB.Database<SyncCheckpoint>;
  }

  private _createLocalSyncEntry(syncEntry: Partial<LocalSyncEntry>): Observable<number> {
    return this._getNextLocalSyncNumber().pipe(
               exhaustMap(syncNumber => {
                 syncEntry._id = `_local/${this._localSyncEntryPrefix}${syncNumber}`;
                 syncEntry.sequence = syncNumber;
                 return from(this._database.put<LocalSyncEntry>(syncEntry as LocalSyncEntry))
                     .pipe(
                         take(1),
                         exhaustMap(_ => this._setLocalSyncNumber(syncNumber).pipe(take(1))),
                     );
               }),
               ) as Observable<number>;
  }

  private _setLocalSyncNumber(syncNumber: number): Observable<number> {
    const db = this._getLocalSyncNumberDb();
    const id = `_local/${this._localSyncNumber}`;
    return from(db.get(id))
        .pipe(
            take(1),
            catchError(_ => obsOf({_id: id, number: 0} as LocalSyncNumber)),
            exhaustMap(
                doc => from(db.post({...(doc as LocalSyncNumber), number: syncNumber}))
                           .pipe(
                               take(1),
                               )),
            map(_ => syncNumber),
        );
  }

  private _getNextLocalSyncNumber(): Observable<number> {
    const db = this._getLocalSyncNumberDb();
    return from(db.get(`_local/${this._localSyncNumber}`))
               .pipe(
                   take(1),
                   map(doc => (doc as LocalSyncNumber).number + 1),
                   catchError(_ => obsOf(1)),
                   ) as Observable<number>;
  }

  private _nextObjectId(tableName: string): Observable<number> {
    const sort = {object_id: 'desc'} as ModelSort;
    const db = this._getLocalDocsDb();
    return this._relationalModelIdxObs({tableName, sort})
        .pipe(
            exhaustMap(
                idx => (from(db.find(this._modelListFindRequest(tableName, {sort}, idx))) as
                        Observable<PouchDB.Find.FindResponse<LocalDoc<any>>>)
                           .pipe(
                               take(1),
                               )),
            map(r => {
              const res = r as PouchDB.Find.FindResponse<LocalDoc<any>>;
              return res.docs.length > 0 ? res.docs[0].object_id + 1 : 1;
            }),
        );
  }

  private _relationalModelIdxObs(
      idxDef?: {tableName: string, selector?: ModelQuerySelector, sort?: ModelSort}):
      Observable<PouchDB.Find.CreateIndexResponse<LocalDoc<any>>> {
    if (idxDef != null && (idxDef.sort != null || idxDef.selector != null)) {
      let sortFields = [] as {[key: string]: 'asc' | 'desc'}[];
      let selectorFields = [] as {[key: string]: 'asc' | 'desc'}[];
      let dir = 'asc' as 'asc' | 'desc';
      if (idxDef.sort != null) {
        const normSort = this._normalizeSortParam(idxDef.sort);
        sortFields = normSort.fields;
        dir = normSort.dir;
      }
      if (idxDef.selector != null) {
        const normSel = this._normalizeSelector(idxDef.selector);
        selectorFields = Object.keys(normSel).map(k => {
          const obj = {} as any;
          obj[k] = dir;
          return obj;
        });
      }
      if (sortFields.length > 0 || selectorFields.length > 0) {
        const fields = [...selectorFields, {table_name: dir}, ...sortFields];
        return (from(this._database.createIndex({
                  index: {
                    name: this._generateIndexName(idxDef.tableName, fields),
                    fields: fields as any
                  }
                })) as Observable<PouchDB.Find.CreateIndexResponse<LocalDoc<any>>>)
            .pipe(
                take(1),
            );
      }
    }
    return (from(this._database.createIndex(this._relationalModelIdx)) as
            Observable<PouchDB.Find.CreateIndexResponse<LocalDoc<any>>>)
        .pipe(
            take(1),
        );
  }

  private _generateIndexName(tableName: string, fields: ModelSort[]): string {
    return `idx___${tableName}___${
        fields
            .map(f => {
              const key = Object.keys(f)[0];
              return `${key.replace('.', '_')}__${f[key]}`;
            })
            .join('___')}`;
  }

  private _subObject(obj: any, fields?: string[]): any {
    if (obj == null || fields == null) {
      return obj;
    }
    obj = obj || {};
    const subObj: any = {};
    (fields || []).forEach(f => subObj[f] = obj[f]);
    return subObj;
  }

  private _checkSync(): void {
    this._checkUpwardSync();
  }

  private _checkUpwardSync(): void {
    zip(this._getLastLocalCheckpoint(), this._getNextLocalSyncNumber())
        .pipe(
            exhaustMap(r => {
              const [checkpoint, syncNumber] = r as [number, number];
              const localSyncDb = this._getLocalSyncDb();
              const gets: Observable<LocalSyncEntry>[] = [];
              const firstId = checkpoint + 1;
              const lastId = Math.min(firstId + this._opts.changesBatchSize! - 1, syncNumber - 1);
              if (lastId <= checkpoint) {
                return obsOf(false);
              }

              const hasNext = lastId < syncNumber - 1;

              this.stop();

              for (let i = firstId; i <= lastId; i++) {
                gets.push(
                    from(localSyncDb.get(`_local/${this._localSyncEntryPrefix}${i}`)) as
                    Observable<LocalSyncEntry>);
              }
              return zip(...gets).pipe(
                  exhaustMap(getsRes => {
                    const entries = getsRes as LocalSyncEntry[];
                    const localDocsDb = this._getLocalDocsDb();
                    const opts = {keys: entries.map(e => e.doc_id), include_docs: true};
                    return from(localDocsDb.allDocs(opts))
                        .pipe(
                            map(ld => {
                              const localDocs = ld as PouchDB.Core.AllDocsResponse<LocalDoc<any>>;
                              const docs = entries.map(
                                  (syncEntry, i) =>
                                      ({syncEntry, localDoc: localDocs.rows[i].doc!}));
                              return {hasNext, docs};
                            }),
                            take(1),
                        );
                  }),
                  exhaustMap(
                      res => this._processUpwardChanges(
                          res as {hasNext: boolean, docs: UpwardChange[]})),
                  take(1),
              );
            }),
            )
        .subscribe(
            hasNext => {
              if (hasNext) {
                this._checkUpwardSync();
              } else {
                this._checkDownwardSync();
              }
            },
            err => {
              this._emitSyncError(err);
              this.start(false);
            });
  }

  private _checkDownwardSync(): void {
    this._getLastRemoteCheckpoint()
        .pipe(exhaustMap(since => {
          const params = `since=${since}&batchSize=${this._opts.changesBatchSize}`;
          return this._httpClient.get<SyncEntry[]>(`${this._syncUrl}?${params}`);
        }))
        .subscribe(changes => {
          this.stop();
          this._processDownwardChanges(changes as SyncEntry[]);
        });
  }

  private _getLastLocalCheckpoint(): Observable<number> {
    return this._getLastCheckpoint(this._localCheckpointKey);
  }

  private _getLastRemoteCheckpoint(): Observable<number> {
    return this._getLastCheckpoint(this._remoteCheckpointKey);
  }

  private _getLastCheckpoint(checkpointKey: string): Observable<number> {
    const db = this._getSyncCheckpointDb();
    return from(db.get(`_local/${checkpointKey}`))
               .pipe(
                   map(d => (d as SyncCheckpoint).checkpoint),
                   catchError(_ => obsOf(0)),
                   ) as Observable<number>;
  }

  private _setLastLocalCheckpoint(checkpoint: number): Observable<number> {
    return this._setLastCheckpoint(this._localCheckpointKey, checkpoint);
  }

  private _setLastRemoteCheckpoint(checkpoint: number): Observable<number> {
    return this._setLastCheckpoint(this._remoteCheckpointKey, checkpoint);
  }

  private _setLastCheckpoint(checkpointKey: string, checkpoint: number): Observable<number> {
    const db = this._getSyncCheckpointDb();
    const docKey = `_local/${checkpointKey}`;
    const doc = {_id: docKey, checkpoint} as SyncCheckpoint;
    return from(db.get(docKey))
        .pipe(
            catchError(_ => obsOf({} as SyncCheckpoint)),
            take(1),
            exhaustMap(d => from(db.put({...(d as SyncCheckpoint), ...doc})).pipe(take(1))),
            catchError(_ => throwError('checkpoint_set_failed')),
            mapTo(checkpoint),
        );
  }

  private _processUpwardChanges(p: {hasNext: boolean, docs: UpwardChange[]}): Observable<boolean> {
    const payload = p.docs.map(doc => {
      return {
        sequence: doc.syncEntry.sequence,
        table_name: doc.syncEntry.table_name,
        object_id: doc.localDoc.object.id,
        entry_type: doc.syncEntry.entry_type,
        object: doc.localDoc.object
      };
    });
    this._emitSyncSyncing();
    return this._httpClient.post<UpwardChangeResult[]>(this._syncUrl, payload)
        .pipe(
            map(res => ({res, seq: null})),
            catchError((err: HttpErrorResponse) => {
              if (err.status !== 409) {
                return throwError(err);
              }
              p.hasNext = true;
              return this._resolveUpwardConflict(p.docs, err.error)
                  .pipe(
                      map(seq => ({res: err.error as UpwardChangeResult[], seq})),
                  );
            }),
            exhaustMap(r => {
              const {res, seq} = r as {res: UpwardChangeResult[], seq: number};
              const conflictError = res.findIndex(e => e.error === 'conflict');
              const lastValidIdx = conflictError - 1;
              const localDocsDb = this._getLocalDocsDb();
              const docsToDel = p.docs.filter(
                  (d, idx) => d.syncEntry.entry_type === 'insert' && idx <= lastValidIdx);
              const sequence = seq != null ? seq : res[res.length - 1].sequence;
              if (docsToDel.length === 0) {
                return obsOf(sequence);
              }
              return from(localDocsDb.allDocs({
                       keys: docsToDel.map(d => d.syncEntry.doc_id),
                       include_docs: true,
                     }))
                  .pipe(
                      take(1),
                      exhaustMap(
                          result =>
                              from(localDocsDb.bulkDocs(
                                       (result as PouchDB.Core.AllDocsResponse<LocalDoc<any>>)
                                           .rows.map(row => ({...row.doc, _deleted: true} as any))))
                                  .pipe(
                                      take(1),
                                      )),
                      map(_ => sequence),
                  );
            }),
            exhaustMap(
                sequence => sequence as number >= 0 ?
                    this._setLastLocalCheckpoint(sequence as number) :
                    obsOf(null)),
            map(_ => p.hasNext),
        );
  }

  private _resolveUpwardConflict(docs: UpwardChange[], result: UpwardChangeResult[]):
      Observable<number> {
    const conflictIdx = result.findIndex(r => r.ok === false && r.error === 'conflict')!;
    const conflict = result[conflictIdx];
    const conflictDoc = docs.find(d => d.syncEntry.sequence === conflict.sequence)!;
    const checkpoint = conflictIdx >= 0 ? result[conflictIdx].sequence - 1 : -1;
    const localDocsDb = this._getLocalDocsDb();
    return this._databaseIsInit.pipe(
        switchMap(_ => this._relationalModelIdxObs()),
        exhaustMap(idx => {
          const findReq = this._modelListFindRequest(
              conflictDoc.syncEntry.table_name, {},
              idx as PouchDB.Find.CreateIndexResponse<LocalDoc<any>>);
          findReq.selector['object_id'] = {$gte: conflictDoc.syncEntry.object_id};
          return from(localDocsDb.find(findReq)).pipe(take(1));
        }),
        exhaustMap(res => {
          const updDocs = (res as PouchDB.Find.FindResponse<LocalDoc<any>>).docs.map((doc, idx) => {
            doc.object_id = doc.object.id = conflict.extra.next_id + idx;
            return doc;
          });
          return from(localDocsDb.bulkDocs(updDocs)).pipe(take(1));
        }),
        map(_ => checkpoint),
    );
  }

  private _processDownwardChanges(syncEntries: SyncEntry[]): void {
    if (syncEntries == null || syncEntries.length === 0) {
      this._emitSyncPaused();
      this.start(false);
      return;
    }
    const changes = syncEntries.map(s => s.id);
    const url = this._changesUrl;
    this._httpClient.post<SyncEntry[]>(url, {changes})
        .pipe(
            catchError(() => {
              this._emitSyncError('network_error');
              return obsOf([]) as Observable<SyncEntry[]>;
            }),
            map(r => r as SyncEntry[]),
            switchMap(docs => {
              return from(changes.map(
                         change => ({change, doc: (docs || []).find(d => d.id === change)}))) as
                  Observable<{change: number, doc: SyncEntry}>;
            }),
            tap(() => this._emitSyncSyncing()),
            map(r => r as {change: number, doc: SyncEntry}),
            concatMap(({change, doc}) => {
              const syncEntry = syncEntries.find(s => s.id === change);
              if (syncEntry == null) {
                return throwError(`missing_change_${change}`);
              }
              if (syncEntry.entry_type === 'delete' && doc == null) {
                return this._processDownwardChange(syncEntry);
              }
              return (
                  doc == null ? throwError(`missing_change_${change}`) :
                                this._processDownwardChange(doc));
            }),
            map(change => change as SyncEntry),
            concatMap((change: SyncEntry) => this._setLastRemoteCheckpoint(change.id)),
            )
        .subscribe(
            _ => {},
            error => {
              this._emitSyncError(error);
              this.start(false);
            },
            () => {
              const hasMore = changes.length > 0;
              if (!hasMore) {
                this._emitSyncPaused();
              }
              this.start(hasMore);
            });
  }

  private _emitSyncError(error: string): void {
    this._status.next({status: 'error', error});
  }

  private _emitSyncPaused(): void {
    this._status.next({status: 'paused'});
  }

  private _emitSyncSyncing(): void {
    this._status.next({status: 'syncing'});
  }

  private _processDownwardChange(change: SyncEntry): Observable<SyncEntry> {
    if (change.entry_type !== 'insert' && change.entry_type !== 'update' &&
        change.entry_type !== 'delete') {
      return throwError('invalid_entry_type');
    }

    const baseReq =
        this._relationalModelIdxObs().pipe(
            exhaustMap(
                idx => from(this._database.find(this._syncEntryFindRequest(change, idx)))
                           .pipe(take(1))),
            ) as Observable<PouchDB.Find.FindResponse<DatabaseContent>>;

    if (change.entry_type === 'insert') {
      return baseReq.pipe(
          exhaustMap(localDocs => {
            if (localDocs.docs.length !== 0) {
              return throwError('existing_doc');
            }
            return from(this._database.post(this._syncEntryToLocalDoc(change))).pipe(take(1));
          }),
          mapTo(change),
      );
    }

    return baseReq.pipe(
               exhaustMap(localDocs => {
                 if (localDocs.docs.length !== 1) {
                   return throwError('unexisting_doc');
                 }

                 const localDoc = localDocs.docs[0];
                 const op = from(
                     change.entry_type === 'update' ?
                         this._database.put({...localDoc, object: change.object}) :
                         this._database.remove(localDoc));
                 return op.pipe(
                     take(1),
                     mapTo(change),
                 );
               }),
               ) as Observable<SyncEntry>;
  }

  private _modelGetFindRequest(
      tableName: string, params: ModelGetParams,
      index?: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>):
      PouchDB.Find.FindRequest<LocalDoc<any>> {
    const req: PouchDB.Find.FindRequest<LocalDoc<any>> = {
      selector: {table_name: tableName, object_id: params.id}
    };
    if (index != null) {
      const idxParts = ((index as any).id || '').split('/');
      if (idxParts.length === 2) {
        req.use_index = idxParts[1];
      }
    }
    return req;
  }

  private _modelBulkIdsFindRequest(
      tableName: string,
      ids: number[],
      index?: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>,
      ): PouchDB.Find.FindRequest<LocalDoc<any>> {
    const req = {selector: {table_name: tableName, object_id: {$in: ids}}} as
        PouchDB.Find.FindRequest<LocalDoc<any>>;
    if (index != null) {
      const idxParts = ((index as any).id || '').split('/');
      if (idxParts.length === 2) {
        req.use_index = idxParts[1];
      }
    }
    return req;
  }

  private _modelQueryFindRequest(
      tableName: string, params: ModelQueryParams,
      index?: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>):
      PouchDB.Find.FindRequest<LocalDoc<any>> {
    const req: PouchDB.Find.FindRequest<LocalDoc<any>> =
        this._modelListFindRequest(tableName, params);
    if (index != null) {
      const idxParts = ((index as any).id || '').split('/');
      if (idxParts.length === 2) {
        req.use_index = idxParts[1];
      }
    }
    return {...req, selector: {...req.selector, ...this._normalizeSelector(params.selector)}};
  }

  private _modelListFindRequest(
      tableName: string, params: ModelListParams,
      index?: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>):
      PouchDB.Find.FindRequest<LocalDoc<any>> {
    const req: PouchDB.Find.FindRequest<LocalDoc<any>> = {selector: {table_name: tableName}};
    if (params.sort != null) {
      const {dir, fields} = this._normalizeSortParam(params.sort);
      req.sort = [{table_name: dir}, ...fields];
    } else {
      req.sort = ['table_name', 'object_id'];
    }
    if (params.start != null) {
      req.skip = params.start;
    }
    if (params.limit != null && params.limit >= 0) {
      req.limit = params.limit;
    }
    if (index != null) {
      const idxParts = ((index as any).id || '').split('/');
      if (idxParts.length === 2) {
        req.use_index = idxParts[1];
      }
    }
    return req;
  }

  private _normalizeSelector(selector: PouchDB.Find.Selector): PouchDB.Find.Selector {
    const normSelector: PouchDB.Find.Selector = {};
    Object.keys(selector).forEach(key => {
      normSelector[`object.${key}`] = selector[key];
    });
    return normSelector;
  }

  private _normalizeSortParam(sortParam: {[prop: string]: 'asc'|'desc'}):
      {dir: 'asc'|'desc', fields: ModelSort[]} {
    let dir: 'asc'|'desc' = 'asc';
    const fields = Object.keys(sortParam).map((key, i) => {
      const sort: any = {};
      if (i == 0) {
        dir = sortParam[key];
      }
      sort[key !== 'object_id' ? `object.${key}` : key] = dir;
      return sort;
    });
    return {dir, fields};
  }

  private _syncEntryFindRequest(
      entry: SyncEntry, index?: PouchDB.Find.CreateIndexResponse<LocalDoc<any>>):
      PouchDB.Find.FindRequest<LocalDoc<any>> {
    const req = {selector: this._syncEntryFindSelector(entry)} as
        PouchDB.Find.FindRequest<LocalDoc<any>>;
    if (index != null) {
      const idxParts = ((index as any).id || '').split('/');
      if (idxParts.length === 2) {
        req.use_index = idxParts[1];
      }
    }
    return req;
  }

  private _syncEntryFindSelector(entry: SyncEntry): PouchDB.Find.Selector {
    return {
      table_name: entry.table_name,
      object_id: entry.object_id,
    };
  }

  private _initLocalDatabase(): void {
    pouchDBStatic.plugin(pouchDBFindPlugin);
    const plugins = this._opts.plugins || [];
    plugins.forEach(plugin => pouchDBStatic.plugin(plugin));
    this._database = new pouchDBStatic(this._opts.localDatabaseName, {
      revs_limit: 1,
      adapter: this._opts.adapter,
    });

    this._database.createIndex(this._relationalModelIdx)
        .then(_ => {
          this._emitSyncPaused();
          this._databaseInit.next(true);
        })
        .catch(_ => this._emitSyncError('indexing_failed'));
  }

  private _syncEntryToLocalDoc(entry: SyncEntry): LocalDoc<any> {
    return {object_id: entry.object_id, table_name: entry.table_name, object: entry.object};
  }
}
