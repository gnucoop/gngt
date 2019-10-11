import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {concat, Observable, of as obsOf, throwError} from 'rxjs';
import {filter, skip} from 'rxjs/operators';

import * as PouchDB from 'pouchdb';

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
  related: number | DbRelatedEntry;
}

const dbEntries: LocalDoc<DbEntry | DbRelatedEntry>[] = [
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

    for (let i = 1 ; i <= 10 ; i++) {
      res.push({sequence: i, ok: true});
    }
    res.push({sequence: 11, ok: false, error: 'conflict', extra: {next_id: 12}});
    this._postRes.push(res);

    for (let i = 12 ; i <= 71 ; i++) {
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
        imports: [
          SyncModule.forRoot({
            baseUrl: 'http://remote/',
            localDatabaseName: dbName
          })
        ],
        providers: [
          {provide: HttpClient, useClass: MockDownwardHttpClient},
        ]
      });

      syncService = TestBed.get(SyncService);
      httpClient = TestBed.get(HttpClient);
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      return new pouchDBStatic(dbName).destroy();
    });

    it('should sync data from remote server', done => {
      httpClient.changes = changes;
      syncService.start();

      return syncService.status.pipe(
        filter(s => s.status === 'paused'),
        skip(1),
      ).subscribe(_ => {
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

      return syncService.status.pipe(
        filter(s => s.status === 'error'),
      ).subscribe(status => {
        syncService.stop();

        const error = status as SyncStatusError;
        expect(error.error).toBe('existing_doc');

        done();
      });
    });

    it('should throw an exception when trying to update an unexisting object', done => {
      httpClient.changes = badUpdateChanges;
      syncService.start();

      return syncService.status.pipe(
        filter(s => s.status === 'error'),
      ).subscribe(status => {
        syncService.stop();

        const error = status as SyncStatusError;
        expect(error.error).toBe('unexisting_doc');

        done();
      });
    });

    it('should throw an exception when trying to delete an unexisting object', done => {
      httpClient.changes = badDeleteChanges;
      syncService.start();

      return syncService.status.pipe(
        filter(s => s.status === 'error'),
      ).subscribe(status => {
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

    beforeEach(done => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        imports: [
          SyncModule.forRoot({
            baseUrl: 'http://remote',
            localDatabaseName: dbName
          })
        ],
        providers: [
          {provide: HttpClient, useClass: MockUpwardHttpClient},
        ]
      });

      syncService = TestBed.get(SyncService);

      const newObjs = [];
      for (let i = 1 ; i <= 70 ; i++) {
        newObjs.push({foo: `bar${i}`});
      }
      concat(...newObjs.map(newObj => syncService.create('table1', newObj))).subscribe(
        _ => {},
        _ => {},
        () => done()
      );
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      return new pouchDBStatic(dbName).destroy();
    });

    it('should sync data from local database', done => {
      syncService.start();

      syncService.status.pipe(
        filter(s => s.status === 'paused'),
        skip(1),
      ).subscribe(_ => {
        syncService.stop();

        syncService.list('table1', {limit: 100}).subscribe(res => {
          expect(res.length).toEqual(70);
          for (let i = 1 ; i <= 10 ; i++) {
            expect(res.find((r: any) => r.id === i)).toBeDefined();
          }
          expect(res.find((r: any) => r.id === 11)).not.toBeDefined();
          for (let i = 12 ; i <= 71 ; i++) {
            expect(res.find((r: any) => r.id === i)).toBeDefined();
          }
          done();
        });
      });
    });
  });

  describe('Local database', () => {
    let syncService: SyncService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          SyncModule.forRoot({
            baseUrl: 'http://remote',
            localDatabaseName: dbName
          })
        ]
      });

      syncService = TestBed.get(SyncService);

      const db = new pouchDBStatic<LocalDoc<DbEntry | DbRelatedEntry>>(dbName);
      dbEntries.forEach(dbe => {
        db.post(dbe).then(() => {});
      });
    });

    afterEach(() => {
      return new pouchDBStatic(dbName).destroy();
    });

    it('should get an object from local database', done => {
      syncService.get('table1', {id: 1}).subscribe(obj => {
        expect(obj).toEqual(dbEntries[0].object);
        done();
      });
    });

    it(
      'should throw a not_found error when trying to get an unexisting object from local db',
      done => {
        syncService.get('table1', {id: 4}).subscribe(_ => {}, err => {
          expect(err).toEqual('not_found');
          done();
        });
      }
    );

    it('should get desired fields of an object from local database', done => {
      const fields = ['id', 'counter'];
      const dbEntry = dbEntries[0];
      syncService.get('table1', {id: 1, fields}).subscribe(obj => {
        expect(dbEntry.object).toEqual(jasmine.objectContaining(obj));
        fields.forEach(field =>  expect(obj[field]).toBeDefined());
        const undefFields = Object.keys(dbEntry.object).filter(f => fields.indexOf(f) === -1);
        undefFields.forEach(field => expect(obj[field]).not.toBeDefined());
        done();
      });
    });

    it('should get an object and its related model from local database', done => {
      const joins = [{model: 'table2', property: 'related', fields: ['color']}];
      syncService.get('table1', {id: 2, joins}).subscribe(obj => {
        const related = dbEntries[4];
        expect(obj.related).toEqual(related.object);
        done();
      });
    });

    it('should list objects from local database', done => {
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      syncService.list('table1', {}).subscribe(objs => {
        expect(entries.length).toEqual(objs.length);
        entries.forEach((entry, i) => {
          expect(entry.object).toEqual(objs[i]);
        });
        done();
      });
    });

    it('should support start and limit params in list', done => {
      const entries = dbEntries.filter(e => e.table_name === 'table1').slice(1, 3);
      syncService.list('table1', {start: 1, limit: 2}).subscribe(objs => {
        expect(entries.length).toEqual(objs.length);
        entries.forEach((entry, i) => {
          expect(entry.object).toEqual(objs[i]);
        });
        done();
      });
    });

    it('should support fields param in list', done => {
      const fields = ['id', 'counter'];
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      syncService.list('table1', {fields}).subscribe(objs => {
        const undefFields = Object.keys(entries[0].object).filter(f => fields.indexOf(f) === -1);
        expect(entries.length).toEqual(objs.length);
        entries.forEach((entry, i) => {
          const obj = objs[i];
          expect(entry.object).toEqual(jasmine.objectContaining(obj));
          fields.forEach(field => expect(obj[field]).toBeDefined());
          undefFields.forEach(field => expect(obj[field]).not.toBeDefined());
        });
        done();
      });
    });

    it('should support joins param in list', done => {
      const entries = dbEntries.filter(e => e.table_name === 'table1');
      const joins = [{model: 'table2', property: 'related', fields: ['color']}];
      syncService.list('table1', {joins}).subscribe(objs => {
        entries.forEach((entry, i) => {
          const related = dbEntries.find(e =>
            e.table_name === 'table2' && e.object_id === (entry.object as DbEntry).related);
          expect(related!.object).toEqual(jasmine.objectContaining(objs[i].related));
        });
        done();
      });
    });

    it('should support sort param in list', done => {
      const entries = dbEntries.filter(e => e.table_name === 'table1')
        .sort((a, b) => (a.object as DbEntry).counter - (b.object as DbEntry).counter);
      syncService.list('table1', {sort: {counter: 'asc'}}).subscribe(objs => {
        entries.forEach((entry, i) => {
          expect(entry.object).toEqual(objs[i]);
        });
        done();
      });
    });

    it('should create an object and save it to the local database', done => {
      const newObj = {foo: '', counter: 0, related: 1};
      const expectedId = dbEntries.filter(e => e.table_name === 'table1')
        .sort((a, b) => b.object_id - a.object_id)[0].object_id + 1;
      syncService.create('table1', newObj).subscribe(res => {
        const newObjWithId = {id: expectedId, ...newObj};
        expect(res).toEqual(newObjWithId);
        syncService.get('table1', {id: expectedId}).subscribe(obj => {
          expect(obj).toEqual(newObjWithId);
          done();
        });
      });
    });

    it('should update an existing object in the local database', done => {
      const entry = dbEntries[0];
      const updated = {...entry.object, counter: 666};
      const id = entry.object_id;
      syncService.update('table1', id, updated).subscribe(res => {
        expect(res).toEqual(updated);
        syncService.get('table1', {id}).subscribe(obj => {
          expect(obj).toEqual(updated);
          done();
        });
      });
    });

    it('should throw an error when trying to update an unexisting object', done => {
      const entry = {...dbEntries[0], object: {...dbEntries[0].object}};
      entry.object_id = entry.object.id = 666;
      syncService.update('table1', entry.object_id, entry.object).subscribe(_ => {}, err => {
        expect(err).toEqual('not_found');
        done();
      });
    });

    it('should delete an existing object in the local database', done => {
      const entry = dbEntries[0];
      const id = entry.object_id;
      syncService.delete('table1', id).subscribe(deleted => {
        expect(deleted).toEqual(entry.object);
        syncService.get('table1', {id}).subscribe(
          _ => {},
          err => {
            expect(err).toEqual('not_found');
            done();
          }
        );
      });
    });

    it('should throw an error when trying to delete an unexisting object', done => {
      syncService.delete('table1', 11).subscribe(
        _ => {},
        err => {
          expect(err).toEqual('not_found');
          done();
        }
      );
    });
  });
});
