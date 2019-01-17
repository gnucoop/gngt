import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';

import {ModelEffects} from '@gngt/core/model';

import {<%= classify(model) %>} from './<%= dasherize(model) %>';
import * as actions from './<%= dasherize(model) %>.actions';
import {<%= classify(model) %>ActionTypes as at} from './<%= dasherize(model) %>.actions';
import {<%= classify(model) %>Manager} from './<%= dasherize(model) %>.manager';
import {<%= classify(model) %>Service} from './<%= dasherize(model) %>.service';
import {State} from './<%= dasherize(model) %>.reducers';

@Injectable()
export class <%= classify(model) %>Effects extends ModelEffects<
    <%= classify(model) %>,
    State,
    actions.<%= classify(model) %>Actions,
    actions.<%= classify(model) %>GetAction,
    actions.<%= classify(model) %>ListAction,
    actions.<%= classify(model) %>CreateAction,
    actions.<%= classify(model) %>UpdateAction,
    actions.<%= classify(model) %>PatchAction,
    actions.<%= classify(model) %>DeleteAction,
    actions.<%= classify(model) %>DeleteAllAction> {
  @Effect() get$: Observable<Action>;
  @Effect() list$: Observable<Action>;
  @Effect() create$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() patch$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() deleteAll$: Observable<Action>;

  constructor(
    _actions: Actions,
    _service: <%= classify(model) %>Service,
    _manager: <%= classify(model) %>Manager
  ) {
    super(_actions, _service, _manager, {
      getActionType: at.GET,
      getSuccessAction: actions.<%= classify(model) %>GetSuccessAction,
      getFailureAction: actions.<%= classify(model) %>GetFailureAction,
      listActionType: at.LIST,
      listSuccessAction: actions.<%= classify(model) %>ListSuccessAction,
      listFailureAction: actions.<%= classify(model) %>ListFailureAction,
      createActionType: at.CREATE,
      createSuccessAction: actions.<%= classify(model) %>CreateSuccessAction,
      createFailureAction: actions.<%= classify(model) %>CreateFailureAction,
      updateActionType: at.UPDATE,
      updateSuccessAction: actions.<%= classify(model) %>UpdateSuccessAction,
      updateFailureAction: actions.<%= classify(model) %>UpdateFailureAction,
      patchActionType: at.PATCH,
      patchSuccessAction: actions.<%= classify(model) %>PatchSuccessAction,
      patchFailureAction: actions.<%= classify(model) %>PatchFailureAction,
      deleteActionType: at.DELETE,
      deleteSuccessAction: actions.<%= classify(model) %>DeleteSuccessAction,
      deleteFailureAction: actions.<%= classify(model) %>DeleteFailureAction,
      deleteAllActionType: at.DELETE_ALL,
      deleteAllSuccessAction: actions.<%= classify(model) %>DeleteAllSuccessAction,
      deleteAllFailureAction: actions.<%= classify(model) %>DeleteAllFailureAction
    });
    this.get$ = this.modelGet$;
    this.list$ = this.modelList$;
    this.create$ = this.modelCreate$;
    this.update$ = this.modelUpdate$;
    this.patch$ = this.modelPatch$;
    this.delete$ = this.modelDelete$;
    this.deleteAll$ = this.modelDeleteAll$;
  }
}
