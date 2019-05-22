import {Injectable} from '@angular/core';

import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';

import {ModelActions, ModelService} from '@gngt/core/model';
import {State} from '@gngt/core/reducers';

import * as <%= camelize(model) %>Actions from './<%= dasherize(model) %>.actions';
import {<%= classify(model) %>} from './<%= dasherize(model) %>';
import * as from<%= classify(model) %> from './<%= dasherize(model) %>.reducers';
import * as fromPackage from './reducers';


@Injectable()
export class <%= classify(model) %>Service
    extends ModelService<
      <%= classify(model) %>,
      from<%= classify(model) %>.State,
      <%= camelize(model) %>Actions.<%= classify(model) %>ActionTypes
    > {
  constructor(store: Store<State>, actions: Actions<ModelActions.ModelBaseAction>) {
    super(
      store,
      actions,
      <%= camelize(model) %>Actions.<%= camelize(model) %>ActionTypes,
      [fromPackage.packageStatePrefix, from<%= classify(model) %>.<%= camelize(model) %>StatePrefix]
    );
  }
}
