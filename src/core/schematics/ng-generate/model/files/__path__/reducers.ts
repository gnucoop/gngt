import {ActionReducerMap} from '@ngrx/store';

import * as fromRoot from '@gngt/core/reducers';
import * as from<%= classify(model) %> from './<%= dasherize(model) %>.reducers';

export const packageStatePrefix = '<%= camelize(package) %>';

export interface <%= classify(package) %>State {
  <%= camelize(model) %>: from<%= classify(model) %>.State;
}

export interface State extends fromRoot.State {
  <%= camelize(package) %>: <%= classify(package) %>State;
}

export const reducers: ActionReducerMap<<%= classify(package) %>State, any> = {
  <%= camelize(model) %>: from<%= classify(model) %>.<%= camelize(model) %>Reducer
};
