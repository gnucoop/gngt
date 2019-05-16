import {Injectable} from '@angular/core';

import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';

import {ModelService} from '@gngt/core/model';
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
      <%= camelize(model) %>Actions.<%= classify(model) %>GetAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>ListAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>CreateAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>UpdateAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>PatchAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>DeleteAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>DeleteAllAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>QueryAction
    > {
  constructor(store: Store<State>, actions: Actions) {
    super(
      store,
      actions,
      <%= camelize(model) %>Actions.<%= classify(model) %>GetAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>ListAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>CreateAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>UpdateAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>PatchAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>DeleteAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>DeleteAllAction,
      <%= camelize(model) %>Actions.<%= classify(model) %>QueryAction,
      [fromPackage.packageStatePrefix, from<%= classify(model) %>.<%= camelize(model) %>StatePrefix]
    );
  }
}
