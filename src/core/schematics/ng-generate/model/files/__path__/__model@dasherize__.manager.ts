import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';

import {MODEL_OPTIONS, ModelManager, ModelOptions} from '@gngt/core/model';
import {<%= classify(model) %>} from './<%= dasherize(model) %>';

import {environment} from '@envs/environment';

@Injectable()
export class <%= classify(model) %>Manager extends ModelManager<<%= classify(model) %>> {
  constructor(@Inject(MODEL_OPTIONS) opts: ModelOptions, http: HttpClient) {
    super(opts, environment.apiConfig.<%= camelize(model) %>.base, http);
  }
}
