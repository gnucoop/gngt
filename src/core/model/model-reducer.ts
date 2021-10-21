/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

import {
  Model,
  ModelGetParams,
  ModelListParams,
  ModelListResult,
  ModelQueryParams,
} from '@gngt/core/common';

import {
  ModelActionTypes,
  ModelBaseAction,
  ModelCreateAction,
  ModelCreateFailureAction,
  ModelCreateSuccessAction,
  ModelDeleteAction,
  ModelDeleteAllAction,
  ModelDeleteAllFailureAction,
  ModelDeleteAllSuccessAction,
  ModelDeleteFailureAction,
  ModelDeleteSuccessAction,
  ModelGetAction,
  ModelGetFailureAction,
  ModelGetSuccessAction,
  ModelListAction,
  ModelListFailureAction,
  ModelListSuccessAction,
  ModelPatchAction,
  ModelPatchFailureAction,
  ModelPatchSuccessAction,
  ModelQueryAction,
  ModelQueryFailureAction,
  ModelQuerySuccessAction,
  ModelUpdateAction,
  ModelUpdateFailureAction,
  ModelUpdateSuccessAction,
} from './model-actions';
import {ModelError} from './model-error';

const stateQueueLimit = 20;

export interface ModelGetState<M extends Model> {
  uuid: string;
  loading: boolean;
  options: ModelGetParams;
  id: number | null;
  object: M | null;
  error: ModelError | null;
}

export interface ModelListState<M extends Model> {
  uuid: string;
  loading: boolean;
  options: ModelListParams;
  objects: ModelListResult<M> | null;
  error: ModelError | null;
}

export interface ModelCreateState<M extends Model> {
  uuid: string;
  loading: boolean;
  object: M | null;
  error: ModelError | null;
}

export interface ModelUpdateState<M extends Model> {
  uuid: string;
  loading: boolean;
  id: number | null;
  object: M | null;
  error: ModelError | null;
}

export interface ModelPatchState<M extends Model> {
  uuid: string;
  loading: boolean;
  id: number | null;
  object: M | null;
  error: ModelError | null;
}

export interface ModelDeleteState<M extends Model> {
  uuid: string;
  loading: boolean;
  id: number | null;
  object: M | null;
  error: ModelError | null;
}

export interface ModelDeleteAllState<M extends Model> {
  uuid: string;
  loading: boolean;
  ids: number[] | null;
  objects: M[] | null;
  error: ModelError | null;
}

export interface ModelQueryState<M extends Model> {
  uuid: string;
  loading: boolean;
  options: ModelQueryParams | null;
  objects: ModelListResult<M> | null;
  error: ModelError | null;
}

export interface State<M extends Model> {
  get: ModelGetState<M>[];
  list: ModelListState<M>[];
  create: ModelCreateState<M>[];
  update: ModelUpdateState<M>[];
  patch: ModelPatchState<M>[];
  delete: ModelDeleteState<M>[];
  deleteAll: ModelDeleteAllState<M>[];
  query: ModelQueryState<M>[];
}

export function generateInitialModelState<M extends Model>(): State<M> {
  return {
    get: [],
    list: [],
    create: [],
    update: [],
    patch: [],
    delete: [],
    deleteAll: [],
    query: [],
  };
}

export function modelReducer<M extends Model>(
  state: State<M>,
  action: ModelBaseAction,
  actionTypes: ModelActionTypes,
): State<M> {
  switch (action.type) {
    case actionTypes.GET:
      return {
        ...state,
        get: [
          {
            uuid: action.uuid,
            loading: true,
            options: {id: null},
            id: (<ModelGetAction>action).payload.id,
            object: null,
            error: null,
          },
          ...state.get.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.GET_SUCCESS:
      const successGetIdx = state.get.findIndex(g => g.uuid === action.uuid);
      if (successGetIdx >= 0) {
        return {
          ...state,
          get: [
            ...state.get.slice(0, successGetIdx),
            {
              ...state.get[successGetIdx],
              loading: false,
              object: (<ModelGetSuccessAction<M>>action).payload.item,
              error: null,
            },
            ...state.get.slice(successGetIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.GET_FAILURE:
      const failureGetIdx = state.get.findIndex(g => g.uuid === action.uuid);
      if (failureGetIdx >= 0) {
        return {
          ...state,
          get: [
            ...state.get.slice(0, failureGetIdx),
            {
              ...state.get[failureGetIdx],
              loading: false,
              object: null,
              error: (<ModelGetFailureAction>action).payload.error,
            },
            ...state.get.slice(failureGetIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.LIST:
      return {
        ...state,
        list: [
          {
            uuid: action.uuid,
            loading: true,
            options: (<ModelListAction>action).payload.params,
            objects: null,
            error: null,
          },
          ...state.list.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.LIST_SUCCESS:
      const successListIdx = state.list.findIndex(g => g.uuid === action.uuid);
      if (successListIdx >= 0) {
        return {
          ...state,
          list: [
            ...state.list.slice(0, successListIdx),
            {
              ...state.list[successListIdx],
              loading: false,
              objects: (<ModelListSuccessAction<M>>action).payload.result,
              error: null,
            },
            ...state.list.slice(successListIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.LIST_FAILURE:
      const failureListIdx = state.list.findIndex(g => g.uuid === action.uuid);
      if (failureListIdx >= 0) {
        return {
          ...state,
          list: [
            ...state.list.slice(0, failureListIdx),
            {
              ...state.list[failureListIdx],
              loading: false,
              objects: null,
              error: (<ModelListFailureAction>action).payload.error,
            },
            ...state.list.slice(failureListIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.CREATE:
      return {
        ...state,
        create: [
          {
            uuid: action.uuid,
            loading: true,
            object: (<ModelCreateAction<M>>action).payload.item,
            error: null,
          },
          ...state.create.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.CREATE_SUCCESS:
      const successCreateIdx = state.create.findIndex(g => g.uuid === action.uuid);
      if (successCreateIdx >= 0) {
        return {
          ...state,
          create: [
            ...state.create.slice(0, successCreateIdx),
            {
              ...state.create[successCreateIdx],
              loading: false,
              object: (<ModelCreateSuccessAction<M>>action).payload.item,
              error: null,
            },
            ...state.create.slice(successCreateIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.CREATE_FAILURE:
      const failureCreateIdx = state.create.findIndex(g => g.uuid === action.uuid);
      if (failureCreateIdx >= 0) {
        return {
          ...state,
          create: [
            ...state.create.slice(0, failureCreateIdx),
            {
              ...state.create[failureCreateIdx],
              loading: false,
              object: null,
              error: (<ModelCreateFailureAction>action).payload.error,
            },
            ...state.create.slice(failureCreateIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.UPDATE:
      return {
        ...state,
        update: [
          {
            uuid: action.uuid,
            loading: true,
            id: (<ModelUpdateAction<M>>action).payload.item.id,
            object: (<ModelUpdateAction<M>>action).payload.item,
            error: null,
          },
          ...state.update.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.UPDATE_SUCCESS:
      const successUpdateIdx = state.update.findIndex(g => g.uuid === action.uuid);
      if (successUpdateIdx >= 0) {
        return {
          ...state,
          update: [
            ...state.update.slice(0, successUpdateIdx),
            {
              ...state.update[successUpdateIdx],
              loading: false,
              object: (<ModelUpdateSuccessAction<M>>action).payload.item,
              error: null,
            },
            ...state.update.slice(successUpdateIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.UPDATE_FAILURE:
      const failureUpdateIdx = state.update.findIndex(g => g.uuid === action.uuid);
      if (failureUpdateIdx >= 0) {
        return {
          ...state,
          update: [
            ...state.update.slice(0, failureUpdateIdx),
            {
              ...state.update[failureUpdateIdx],
              loading: false,
              object: null,
              error: (<ModelUpdateFailureAction>action).payload.error,
            },
            ...state.update.slice(failureUpdateIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.PATCH:
      return {
        ...state,
        patch: [
          {
            uuid: action.uuid,
            loading: true,
            id: (<ModelPatchAction<M>>action).payload.item.id,
            object: (<ModelPatchAction<M>>action).payload.item,
            error: null,
          },
          ...state.patch.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.PATCH_SUCCESS:
      const successPatchIdx = state.patch.findIndex(g => g.uuid === action.uuid);
      if (successPatchIdx >= 0) {
        return {
          ...state,
          patch: [
            ...state.patch.slice(0, successPatchIdx),
            {
              ...state.patch[successPatchIdx],
              loading: false,
              object: (<ModelPatchSuccessAction<M>>action).payload.item,
              error: null,
            },
            ...state.patch.slice(successPatchIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.PATCH_FAILURE:
      const failurePatchIdx = state.patch.findIndex(g => g.uuid === action.uuid);
      if (failurePatchIdx >= 0) {
        return {
          ...state,
          patch: [
            ...state.patch.slice(0, failurePatchIdx),
            {
              ...state.patch[failurePatchIdx],
              loading: false,
              object: null,
              error: (<ModelPatchFailureAction>action).payload.error,
            },
            ...state.patch.slice(failurePatchIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.DELETE:
      return {
        ...state,
        delete: [
          {
            uuid: action.uuid,
            loading: true,
            id: (<ModelDeleteAction<M>>action).payload.item.id,
            object: null,
            error: null,
          },
          ...state.delete.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.DELETE_SUCCESS:
      const successDeleteIdx = state.delete.findIndex(g => g.uuid === action.uuid);
      if (successDeleteIdx >= 0) {
        return {
          ...state,
          delete: [
            ...state.delete.slice(0, successDeleteIdx),
            {
              ...state.delete[successDeleteIdx],
              loading: false,
              object: (<ModelDeleteSuccessAction<M>>action).payload.item,
              error: null,
            },
            ...state.delete.slice(successDeleteIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.DELETE_FAILURE:
      const failureDeleteIdx = state.delete.findIndex(g => g.uuid === action.uuid);
      if (failureDeleteIdx >= 0) {
        return {
          ...state,
          delete: [
            ...state.delete.slice(0, failureDeleteIdx),
            {
              ...state.delete[failureDeleteIdx],
              loading: false,
              object: null,
              error: (<ModelDeleteFailureAction>action).payload.error,
            },
            ...state.delete.slice(failureDeleteIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.DELETE_ALL:
      return {
        ...state,
        deleteAll: [
          {
            uuid: action.uuid,
            loading: true,
            ids: (<ModelDeleteAllAction<M>>action).payload.items.map(i => i.id),
            objects: null,
            error: null,
          },
          ...state.deleteAll.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.DELETE_ALL_SUCCESS:
      const successDeleteAllIdx = state.deleteAll.findIndex(g => g.uuid === action.uuid);
      if (successDeleteAllIdx >= 0) {
        return {
          ...state,
          deleteAll: [
            ...state.deleteAll.slice(0, successDeleteAllIdx),
            {
              ...state.deleteAll[successDeleteAllIdx],
              loading: false,
              objects: (<ModelDeleteAllSuccessAction<M>>action).payload.items,
              error: null,
            },
            ...state.deleteAll.slice(successDeleteAllIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.DELETE_ALL_FAILURE:
      const failureDeleteAllIdx = state.deleteAll.findIndex(g => g.uuid === action.uuid);
      if (failureDeleteAllIdx >= 0) {
        return {
          ...state,
          deleteAll: [
            ...state.deleteAll.slice(0, failureDeleteAllIdx),
            {
              ...state.deleteAll[failureDeleteAllIdx],
              loading: false,
              objects: null,
              error: (<ModelDeleteAllFailureAction>action).payload.error,
            },
            ...state.deleteAll.slice(failureDeleteAllIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.QUERY:
      return {
        ...state,
        query: [
          {
            uuid: action.uuid,
            loading: true,
            options: (<ModelQueryAction>action).payload.params,
            objects: null,
            error: null,
          },
          ...state.query.slice(0, stateQueueLimit - 1),
        ],
      };

    case actionTypes.QUERY_SUCCESS:
      const successQueryIdx = state.query.findIndex(g => g.uuid === action.uuid);
      if (successQueryIdx >= 0) {
        return {
          ...state,
          query: [
            ...state.query.slice(0, successQueryIdx),
            {
              ...state.query[successQueryIdx],
              loading: false,
              options: {...state.query[successQueryIdx].options!},
              objects: (<ModelQuerySuccessAction<M>>action).payload.result,
              error: null,
            },
            ...state.query.slice(successQueryIdx + 1),
          ],
        };
      }
      return state;

    case actionTypes.QUERY_FAILURE:
      const failureQueryIdx = state.query.findIndex(g => g.uuid === action.uuid);
      if (failureQueryIdx >= 0) {
        return {
          ...state,
          query: [
            ...state.query.slice(0, failureQueryIdx),
            {
              ...state.query[failureQueryIdx],
              loading: false,
              options: {...state.query[failureQueryIdx].options!},
              objects: null,
              error: (<ModelQueryFailureAction>action).payload.error,
            },
            ...state.query.slice(failureQueryIdx + 1),
          ],
        };
      }
      return state;

    default:
      return state;
  }
}
