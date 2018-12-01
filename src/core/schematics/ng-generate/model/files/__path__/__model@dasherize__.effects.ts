import {Injectable} from '@angular/core';

import {Actions, Effect} from '@ngrx/effects';

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
  @Effect() get$;
  @Effect() list$;
  @Effect() create$;
  @Effect() update$;
  @Effect() patch$;
  @Effect() delete$;
  @Effect() deleteAll$;

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
    this.delete$ = this.modelDelete$;
  }
}
