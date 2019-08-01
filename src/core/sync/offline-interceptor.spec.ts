import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';

import * as PouchDB from 'pouchdb';

import {LocalDoc} from './local-doc';
import {SyncModule} from './sync-module';
import {registerSyncModel} from './sync-utils';

const pouchDBStatic: PouchDB.Static = (<any>PouchDB).default || PouchDB;

const dbName = 'testdb';

interface DbEntry {
  id: number;
  foo: string;
}

const dbEntries: LocalDoc<DbEntry>[] = [
  {object_id: 1, table_name: 'table', object: {id: 1, foo: 'bar'}},
  {object_id: 2, table_name: 'table', object: {id: 2, foo: 'baz'}},
  {object_id: 3, table_name: 'table', object: {id: 3, foo: 'qux'}}
];

const errorEvent: ErrorEvent = new ErrorEvent('');

describe('OfflineInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        SyncModule.forRoot({
          baseUrl: 'http://remote',
          localDatabaseName: dbName
        })
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);

    registerSyncModel('http://remote/table', 'table');

    const db = new pouchDBStatic<LocalDoc<DbEntry>>(dbName);
    dbEntries.forEach(dbe => {
      db.post(dbe).then(() => {});
    });
  });

  afterEach(() => {
    httpMock.verify();
    return new pouchDBStatic(dbName).destroy();
  });

  it('should not intercept the request doesn\'t match a model endpoint', done => {
    const url = 'http://remote/non_model_endpoint';
    httpClient.get<any>(url).subscribe(
      () => {},
      err => {
        expect(err).toBeDefined();
        expect(err.status).toEqual(0);
        done();
      }
    );

    const req = httpMock.expectOne(url);
    req.error(errorEvent, {status: 0});
  });

  it('should return an object from local db when trying to get the object offline', done => {
    const dbEntry = dbEntries[0];
    const url = `http://remote/table/${dbEntry.object_id}`;
    httpClient.get<DbEntry>(url).subscribe(obj => {
      expect(obj).toEqual(dbEntry.object);
      done();
    });

    const req = httpMock.expectOne(url);
    req.error(errorEvent, {status: 0});
  });

  it('should return a list of objects from local db when trying to list objects offline', done => {
    const url = 'http://remote/table';
    httpClient.get<DbEntry[]>(url).subscribe(entries => {
      expect(entries.length).toEqual(dbEntries.length);
      dbEntries.forEach((dbe, i) => {
        expect(dbe.object).toEqual(entries[i]);
      });
      done();
    });

    const req = httpMock.expectOne(url);
    req.error(errorEvent, {status: 0});
  });
});
