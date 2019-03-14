import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, Optional} from '@angular/core';

import {MODEL_OPTIONS, ModelManager, ModelOptions} from '@gngt/core/model';
import {SyncService} from '@gngt/core/sync';
import {<%= classify(model) %>} from './<%= dasherize(model) %>';

import {environment} from '@envs/environment';

@Injectable()
export class <%= classify(model) %>Manager extends ModelManager<<%= classify(model) %>> {
  constructor(
      @Inject(MODEL_OPTIONS) opts: ModelOptions,
      http: HttpClient,
      @Optional() syncService?: SyncService
  ) {
    super(opts, environment.apiConfig.<%= camelize(model) %>.base, http, syncService);
  }
}
