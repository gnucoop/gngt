import {Injectable} from '@angular/core';

import {Actions} from '@ngrx/effects';

import {ModelEffects} from '@gngt/core/model';

import {<%= classify(model) %>} from './<%= dasherize(model) %>';
import * as actions from './<%= dasherize(model) %>.actions';
import {<%= classify(model) %>Manager} from './<%= dasherize(model) %>.manager';
import {<%= classify(model) %>Service} from './<%= dasherize(model) %>.service';
import {State} from './<%= dasherize(model) %>.reducers';

@Injectable()
export class <%= classify(model) %>Effects extends ModelEffects<
    <%= classify(model) %>,
    State,
    actions.<%= classify(model) %>Actions,
    actions.<%= classify(model) %>ActionTypes> {

  constructor(
    _actions: Actions,
    _service: <%= classify(model) %>Service,
    _manager: <%= classify(model) %>Manager
  ) {
    super(_actions, _service, _manager, actions.<%= camelize(model) %>ActionTypes);
  }
}
