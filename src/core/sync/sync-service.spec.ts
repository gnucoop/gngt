import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import * as PouchDB from 'pouchdb';
import {Observable, of as obsOf, throwError} from 'rxjs';
import {filter, skip} from 'rxjs/operators';

import {LocalDoc} from './local-doc';
import {SyncEntry} from './sync-entry';
import {SyncModule} from './sync-module';
import {SyncService} from './sync-service';
import {SyncStatusError} from './sync-status';
import {UpwardChangeResult} from './upward-change-result';

const pouchDBStatic: PouchDB.Static = (<any>PouchDB).default || PouchDB;

const dbName = 'testdb';

const changes: SyncEntry[] = [
  {id: 1, table_name: 'table1', object_id: 1, entry_type: 'insert', object: {id: 1, foo: 'bar'}},
  {id: 2, table_name: 'table1', object_id: 2, entry_type: 'insert', object: {id: 2, foo: 'baz'}},
  {id: 3, table_name: 'table1', object_id: 1, entry_type: 'update', object: {id: 1, foo: 'qux'}},
];

const badInsertChanges: SyncEntry[] = [
  {id: 1, table_name: 'table1', object_id: 1, entry_type: 'insert', object: {id: 1, foo: 'bar'}},
  {id: 2, table_name: 'table1', object_id: 1, entry_type: 'insert', object: {id: 1, foo: 'baz'}},
];

const badUpdateChanges: SyncEntry[] = [
  {id: 1, table_name: 'table1', object_id: 1, entry_type: 'update', object: {id: 1, foo: 'bar'}},
];

const badDeleteChanges: SyncEntry[] = [
  {id: 1, table_name: 'table1', object_id: 1, entry_type: 'delete', object: {id: 1, foo: 'bar'}},
];

interface DbRelatedEntry {
  id: number;
  color: string;
}

interface DbEntry {
  id: number;
  foo: string;
  counter: number;
  related: number|DbRelatedEntry;
}

const dbEntries: LocalDoc<DbEntry|DbRelatedEntry>[] = [
  {object_id: 1, table_name: 'table1', object: {id: 1, foo: 'bar', counter: 10, related: 1}},
  {object_id: 2, table_name: 'table1', object: {id: 2, foo: 'baz', counter: 222, related: 2}},
  {object_id: 3, table_name: 'table1', object: {id: 3, foo: 'qux', counter: 97, related: 3}},
  {object_id: 1, table_name: 'table2', object: {id: 1, color: 'red'}},
  {object_id: 2, table_name: 'table2', object: {id: 2, color: 'blue'}},
  {object_id: 3, table_name: 'table2', object: {id: 3, color: 'yellow'}},
];

class MockDownwardHttpClient {
  changes: SyncEntry[];

  get(url: string): Observable<any> {
    if (url === 'http://remote/changes?since=0&batchSize=50') {
      return obsOf(this.changes);
    }
    return obsOf([]);
  }

  post(url: string): Observable<any> {
    if (url === 'http://remote/docs') {
      return obsOf(this.changes);
    }
    return obsOf([]);
  }
}

class MockUpwardHttpClient {
  private _postCounter = 0;
  private _postRes: UpwardChangeResult[][] = [];

  constructor() {
    let res: UpwardChangeResult[] = [];

    for (let i = 1; i <= 10; i++) {
      res.push({sequence: i, ok: true});
    }
    res.push({sequence: 11, ok: false, error: 'conflict', extra: {next_id: 12}});
    this._postRes.push(res);

    res = [];
    for (let i = 12; i <= 71; i++) {
      res.push({sequence: i, ok: true});
    }
    this._postRes.push(res);
  }

  get(): Observable<any> {
    return obsOf([]);
  }

  post(_url: string, _body: any): Observable<any> {
    if (this._postCounter === 0) {
      return throwError({status: 409, error: this._postRes[this._postCounter++]});
    }
    if (this._postCounter < this._postRes.length) {
      return obsOf(this._postRes[this._postCounter++]);
    }
    return obsOf([]);
  }
}

describe('SyncService', () => {
  describe('Downward sync', () => {
    let syncService: SyncService;
    let httpClient: MockDownwardHttpClient;
    let originalTimeout: number;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SyncModule.forRoot({baseUrl: 'http://remote/', localDatabaseName: dbName})],
        providers: [
          {provide: HttpClient, useClass: MockDownwardHttpClient},
        ]
      });

      syncService = TestBed.get(SyncService);
      httpClient = TestBed.get(HttpClient);
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      return new pouchDBStatic(dbName).destroy();
    });

    it('should sync data from remote server', done => {
      httpClient.changes = changes;
      syncService.start();

      return syncService.status
          .pipe(
              filter(s => s.status === 'paused'),
              skip(1),
              )
          .subscribe(_ => {
            syncService.stop();

            const db = new pouchDBStatic<LocalDoc<any>>(dbName);

            db.allDocs({include_docs: true}).then(docs => {
              const localDocs = docs.rows.filter(r => r.doc != null && r.doc!.object_id != null)
                                    .map(r => r.doc as LocalDoc<any>);

              expect(localDocs.length).toBe(2);

              const localDoc1 = localDocs.find(l => l.object_id === 1);
              const localDoc2 = localDocs.find(l => l.object_id === 2);

              expect(localDoc1).toBeDefined();
              expect(localDoc2).toBeDefined();
              expect(localDoc1!.object_id).toEqual(changes[2].object_id);
              expect(localDoc1!.table_name).toEqual(changes[2].table_name);
              expect(localDoc2!.object_id).toEqual(changes[1].object_id);
              expect(localDoc2!.table_name).toEqual(changes[1].table_name);
              expect(localDoc1!.object).toEqual(changes[2].object);
              expect(localDoc2!.object).toEqual(changes[1].object);

              done();
            });
          });
    });

    it('should throw an exception when trying to insert twice the same object', done => {
      httpClient.changes = badInsertChanges;
      syncService.start();

      return syncService.status
          .pipe(
              filter(s => s.status === 'error'),
              )
          .subscribe(status => {
            syncService.stop();

            const error = status as SyncStatusError;
            expect(error.error).toBe('existing_doc');

            done();
          });
    });

    it('should throw an exception when trying to update an unexisting object', done => {
      httpClient.changes = badUpdateChanges;
      syncService.start();

      return syncService.status
          .pipe(
              filter(s => s.status === 'error'),
              )
          .subscribe(status => {
            syncService.stop();

            const error = status as SyncStatusError;
            expect(error.error).toBe('unexisting_doc');

            done();
          });
    });

    it('should throw an exception when trying to delete an unexisting object', done => {
      httpClient.changes = badDeleteChanges;
      syncService.start();

      return syncService.status
          .pipe(
              filter(s => s.status === 'error'),
              )
          .subscribe(status => {
            syncService.stop();

            const error = status as SyncStatusError;
            expect(error.error).toBe('unexisting_doc');

            done();
          });
    });
  });

  describe('Upward sync', () => {
    let syncService: SyncService;
    let originalTimeout: number;

    beforeEach(async () => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

      TestBed.configureTestingModule({
        imports: [SyncModule.forRoot({baseUrl: 'http://remote', localDatabaseName: dbName})],
        providers: [
          {provide: HttpClient, useClass: MockUpwardHttpClient},
        ]
      });

      syncService = TestBed.get(SyncService);

      // TODO(trik) only 20 docs because the other should need further
      // response from mock service
      for (let i = 1; i <= 20; i++) {
        await syncService.create('table1', {foo: `bar${i}`}).toPromise();
      }
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      return new pouchDBStatic(dbName).destroy();
    });

    it('should sync data from local database', done => {
      syncService.start();

      syncService.status
          .pipe(
              filter(s => s.status === 'paused'),
              skip(1),
              )
          .subscribe(_ => {
            syncService.stop();

            syncService.list('table1', {limit: 100}).subscribe(res => {
              expect(res.results.length).toEqual(10);
              for (let i = 1; i <= 10; i++) {
                expect(res.results.find((r: any) => r.id === i)).not.toBeDefined();
              }
              expect(res.results.find((r: any) => r.id === 11)).not.toBeDefined();
              for (let i = 12; i <= 20; i++) {
                expect(res.results.find((r: any) => r.id === i)).toBeDefined();
              }
              done();
            });
          });
    });
  });

  describe('Local database', () => {
    let syncService: SyncService;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          SyncModule.forRoot({baseUrl: 'http://remote', localDatabaseName: dbName})
        ]
      });

      syncService = TestBed.get(SyncService);

      const db = new pouchDBStatic<LocalDoc<DbEntry|DbRelatedEntry>>(dbName);
      for (let i = 0; i < dbEntries.length; i++) {
        await db.post(dbEntries[i]);
      }
    });

    afterEach(() => {
      return new pouchDBStatic(dbName).destroy();
    });

    it('should get an object from local database', () => {
      const obj = syncService.get('table1', {id: 1}).toPromise();
      expectAsync(obj).toBeResolvedTo(dbEntries[0].object);
    });

    it('should throw a not_found error when trying to get an unexisting object from local db',
       () => {
         const promise = syncService.get('table1', {id: 4}).toPromise();
         expectAsync(promise).toBeRejectedWithError('not_found');
       });

    it('should get desired fields of an object from local database', async () => {
      const fields = ['id', 'counter'];
      const dbEntry = dbEntries[0];
      const obj = await syncService.get('table1', {id: 1, fields}).toPromise();
      expect(dbEntry.object).toEqual(jasmine.objectContaining(obj));
      fields.forEach(field => expect(obj[field]).toBeDefined());
      const undefFields = Object.keys(dbEntry.object).filter(f => fields.indexOf(f) === -1);
      undefFields.forEach(field => expect(obj[field]).not.toBeDefined());
    });

    it('should get an object and its related model from local database', async () => {
      const joins = [{model: 'table2', property: 'related', fields: ['color']}];
      const obj = await syncService.get('table1', {id: 2, joins}).toPromise();
      const related = dbEntries[4];
      expect(obj.related).toEqual(related.object);
    });

    it('should list objects from local database', async () => {
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      const objs = await syncService.list('table1', {}).toPromise();
      expect(entries.length).toEqual(objs.results.length);
      entries.forEach((entry, i) => {
        expect(entry.object).toEqual(objs.results[i]);
      });
    });

    it('should support start and limit params in list', async () => {
      const entries = dbEntries.filter(e => e.table_name === 'table1').slice(1, 3);
      const objs = await syncService.list('table1', {start: 1, limit: 2}).toPromise();
      expect(entries.length).toEqual(objs.results.length);
      entries.forEach((entry, i) => {
        expect(entry.object).toEqual(objs.results[i]);
      });
    });

    it('should support fields param in list', async () => {
      const fields = ['id', 'counter'];
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      const objs = await syncService.list('table1', {fields}).toPromise();
      const undefFields = Object.keys(entries[0].object).filter(f => fields.indexOf(f) === -1);
      expect(entries.length).toEqual(objs.results.length);
      entries.forEach((entry, i) => {
        const obj = objs.results[i];
        expect(entry.object).toEqual(jasmine.objectContaining(obj));
        fields.forEach(field => expect(obj[field]).toBeDefined());
        undefFields.forEach(field => expect(obj[field]).not.toBeDefined());
      });
    });

    it('should support joins param in list', async () => {
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      const joins = [{model: 'table2', property: 'related', fields: ['color']}];
      const objs = await syncService.list('table1', {joins}).toPromise();
      entries.forEach((entry, i) => {
        const related = dbEntries.find(
            e => e.table_name === 'table2' && e.object_id === (entry.object as DbEntry).related);
        expect(related!.object).toEqual(jasmine.objectContaining(objs.results[i].related));
      });
    });

    it('should support sort param in list', async () => {
      const entries =
          dbEntries.filter(e => e.table_name === 'table1')
              .sort((a, b) => (a.object as DbEntry).counter - (b.object as DbEntry).counter);
      const objs = await syncService.list('table1', {sort: {counter: 'asc'}}).toPromise();
      entries.forEach((entry, i) => {
        expect(entry.object).toEqual(objs.results[i]);
      });
    });

    it('should create an object and save it to the local database', () => {
      const newObj = {foo: '', counter: 0, related: 1};
      const expectedId = dbEntries.filter(e => e.table_name === 'table1')
                             .sort((a, b) => b.object_id - a.object_id)[0]
                             .object_id +
          1;
      const res = syncService.create('table1', newObj).toPromise();
      const newObjWithId = {id: expectedId, ...newObj};
      expectAsync(res).toBeResolvedTo(newObjWithId);
      const obj = syncService.get('table1', {id: expectedId}).toPromise();
      expectAsync(obj).toBeResolvedTo(newObjWithId);
    });

    it('should update an existing object in the local database', () => {
      const entry = dbEntries[0];
      const updated = {...entry.object, counter: 666};
      const id = entry.object_id;
      const res = syncService.update('table1', id, updated).toPromise();
      expectAsync(res).toBeResolvedTo(updated);
      const obj = syncService.get('table1', {id}).toPromise();
      expectAsync(obj).toBeResolvedTo(updated);
    });

    it('should throw an error when trying to update an unexisting object', () => {
      const entry = {...dbEntries[0], object: {...dbEntries[0].object}};
      entry.object_id = entry.object.id = 666;
      const promise = syncService.update('table1', entry.object_id, entry.object).toPromise();
      expectAsync(promise).toBeRejectedWithError('not_found');
    });

    it('should delete an existing object in the local database', () => {
      const entry = dbEntries[0];
      const id = entry.object_id;
      const deleted = syncService.delete('table1', id).toPromise();
      expectAsync(deleted).toBeResolvedTo(entry.object);
      const promise = syncService.get('table1', {id}).toPromise();
      expectAsync(promise).toBeRejectedWithError('not_found');
    });

    it('should throw an error when trying to delete an unexisting object', () => {
      const promise = syncService.delete('table1', 11).toPromise();
      expectAsync(promise).toBeRejectedWithError('not_found');
    });
  });
});
