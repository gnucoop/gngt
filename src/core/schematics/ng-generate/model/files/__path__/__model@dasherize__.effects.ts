import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';

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
  @Effect() get$: Observable<Action>;
  @Effect() list$: Observable<Action>;
  @Effect() create$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() patch$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() deleteAll$: Observable<Action>;
  @Effect() query$: Observable<Action>;

  constructor(
    _actions: Actions,
    _service: <%= classify(model) %>Service,
    _manager: <%= classify(model) %>Manager
  ) {
    super(_actions, _service, _manager, actions.<%= camelize(model) %>ActionTypes);
    this.get$ = this.modelGet$;
    this.list$ = this.modelList$;
    this.create$ = this.modelCreate$;
    this.update$ = this.modelUpdate$;
    this.patch$ = this.modelPatch$;
    this.delete$ = this.modelDelete$;
    this.deleteAll$ = this.modelDeleteAll$;
    this.query$ = this.modelQuery$;
  }
}
