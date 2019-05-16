import {ModelActions} from '@gngt/core/model';
// import {type} from '@gngt/core/reducers';
import {<%= classify(model) %>} from './<%= dasherize(model) %>';

// tslint:disable-next-line
export interface <%= classify(model) %>ActionTypes extends ModelActions.ModelActionTypes {
}

// tslint:disable-next-line
export const <%= camelize(model) %>ActionTypes: <%= classify(model) %>ActionTypes =
  Object.assign({}, ModelActions.generateModelActionTypes('<%= classify(model) %>'), {
  });

export class <%= classify(model) %>ListAction
    extends ModelActions.ModelListAction {
  type = <%= camelize(model) %>ActionTypes.LIST;
}
export class <%= classify(model) %>ListFailureAction
    extends ModelActions.ModelListFailureAction {
  type = <%= camelize(model) %>ActionTypes.LIST_FAILURE;
}
export class <%= classify(model) %>ListSuccessAction
    extends ModelActions.ModelListSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.LIST_SUCCESS;
}
export class <%= classify(model) %>GetAction
    extends ModelActions.ModelGetAction {
  type = <%= camelize(model) %>ActionTypes.GET;
}
export class <%= classify(model) %>GetFailureAction
    extends ModelActions.ModelGetFailureAction {
  type = <%= camelize(model) %>ActionTypes.GET_FAILURE;
}
export class <%= classify(model) %>GetSuccessAction
    extends ModelActions.ModelGetSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.GET_SUCCESS;
}
export class <%= classify(model) %>CreateAction
    extends ModelActions.ModelCreateAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.CREATE;
}
export class <%= classify(model) %>CreateFailureAction
    extends ModelActions.ModelCreateFailureAction {
  type = <%= camelize(model) %>ActionTypes.CREATE_FAILURE;
}
export class <%= classify(model) %>CreateSuccessAction
    extends ModelActions.ModelCreateSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.CREATE_SUCCESS;
}
export class <%= classify(model) %>UpdateAction
    extends ModelActions.ModelUpdateAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.UPDATE;
}
export class <%= classify(model) %>UpdateFailureAction
    extends ModelActions.ModelUpdateFailureAction {
  type = <%= camelize(model) %>ActionTypes.UPDATE_FAILURE;
}
export class <%= classify(model) %>UpdateSuccessAction
    extends ModelActions.ModelUpdateSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.UPDATE_SUCCESS;
}
export class <%= classify(model) %>PatchAction
    extends ModelActions.ModelPatchAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.PATCH;
}
export class <%= classify(model) %>PatchFailureAction
    extends ModelActions.ModelPatchFailureAction {
  type = <%= camelize(model) %>ActionTypes.PATCH_FAILURE;
}
export class <%= classify(model) %>PatchSuccessAction
    extends ModelActions.ModelPatchSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.PATCH_SUCCESS;
}
export class <%= classify(model) %>DeleteAction
    extends ModelActions.ModelDeleteAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.DELETE;
}
export class <%= classify(model) %>DeleteFailureAction
    extends ModelActions.ModelDeleteFailureAction {
  type = <%= camelize(model) %>ActionTypes.DELETE_FAILURE;
}
export class <%= classify(model) %>DeleteSuccessAction
    extends ModelActions.ModelDeleteSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.DELETE_SUCCESS;
}
export class <%= classify(model) %>DeleteAllAction
    extends ModelActions.ModelDeleteAllAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.DELETE_ALL;
}
export class <%= classify(model) %>DeleteAllFailureAction
    extends ModelActions.ModelDeleteAllFailureAction {
  type = <%= camelize(model) %>ActionTypes.DELETE_ALL_FAILURE;
}
export class <%= classify(model) %>DeleteAllSuccessAction
    extends ModelActions.ModelDeleteAllSuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.DELETE_ALL_SUCCESS;
}
export class <%= classify(model) %>QueryAction extends ModelActions.ModelQueryAction {
  type = <%= camelize(model) %>ActionTypes.QUERY;
}
export class <%= classify(model) %>QueryFailureAction
    extends ModelActions.ModelQueryFailureAction {
  type = <%= camelize(model) %>ActionTypes.QUERY_FAILURE;
}
export class <%= classify(model) %>QuerySuccessAction
    extends ModelActions.ModelQuerySuccessAction<<%= classify(model) %>> {
  type = <%= camelize(model) %>ActionTypes.QUERY_SUCCESS;
}

export type <%= classify(model) %>Actions =
  | <%= classify(model) %>GetAction
  | <%= classify(model) %>GetFailureAction
  | <%= classify(model) %>GetSuccessAction
  | <%= classify(model) %>ListAction
  | <%= classify(model) %>ListFailureAction
  | <%= classify(model) %>ListSuccessAction
  | <%= classify(model) %>CreateAction
  | <%= classify(model) %>CreateFailureAction
  | <%= classify(model) %>CreateSuccessAction
  | <%= classify(model) %>UpdateAction
  | <%= classify(model) %>UpdateFailureAction
  | <%= classify(model) %>UpdateSuccessAction
  | <%= classify(model) %>PatchAction
  | <%= classify(model) %>PatchFailureAction
  | <%= classify(model) %>PatchSuccessAction
  | <%= classify(model) %>DeleteAction
  | <%= classify(model) %>DeleteFailureAction
  | <%= classify(model) %>DeleteSuccessAction
  | <%= classify(model) %>DeleteAllAction
  | <%= classify(model) %>DeleteAllFailureAction
  | <%= classify(model) %>DeleteAllSuccessAction
  | <%= classify(model) %>QueryAction
  | <%= classify(model) %>QueryFailureAction
  | <%= classify(model) %>QuerySuccessAction
;
