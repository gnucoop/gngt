/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
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

import {Action} from '@ngrx/store';

import {
  Model, ModelGetParams, ModelListParams, ModelListResult, ModelQueryParams
} from '@gngt/core/common';
import * as ModelActions from './model-actions';


export interface State<M extends Model> {
  get: {
    loading: boolean;
    options: ModelGetParams;
    id: number | null;
    object: M | null;
    error: any;
  };
  list: {
    loading: boolean;
    options: ModelListParams;
    objects: ModelListResult<M> | null;
    error: any;
  };
  create: {
    loading: boolean;
    object: M | null;
    error: any;
  };
  update: {
    loading: boolean;
    id: number | null;
    object: M | null;
    error: any;
  };
  patch: {
    loading: boolean;
    id: number | null;
    object: M | null;
    error: any;
  };
  delete: {
    loading: boolean;
    id: number | null;
    object: M | null;
    error: any;
  };
  deleteAll: {
    loading: boolean;
    ids: number[] | null;
    objects: M[] | null;
    error: any;
  };
  query: {
    loading: boolean;
    options: ModelQueryParams | null;
    objects: ModelListResult<M> | null;
    error: any;
  };
}

export function generateInitialModelState<M extends Model>(): State<M> {
  return {
    get: {
      loading: false,
      options: {id: null},
      id: null,
      object: null,
      error: null
    },
    list: {
      loading: false,
      options: {},
      objects: null,
      error: null
    },
    create: {
      loading: false,
      object: null,
      error: null
    },
    update: {
      loading: false,
      id: null,
      object: null,
      error: null
    },
    patch: {
      loading: false,
      id: null,
      object: null,
      error: null
    },
    delete: {
      loading: false,
      id: null,
      object: null,
      error: null
    },
    deleteAll: {
      loading: false,
      ids: null,
      objects: null,
      error: null
    },
    query: {
      loading: false,
      options: null,
      objects: null,
      error: null
    },
  };
}

export function modelReducer<M extends Model>(
  state: State<M>,
  action: Action,
  actionTypes: ModelActions.ModelActionTypes
): State<M> {
  switch (action.type) {

    case actionTypes.GET:
    return {
      ...state,
      get: {
        ...state.get,
        loading: true,
        options: {id: null},
        id: (<ModelActions.ModelGetAction>action).payload.id,
        object: null,
        error: null
      }
    };

    case actionTypes.GET_SUCCESS:
    return {
      ...state,
      get: {
        ...state.get,
        loading: false,
        object: (<ModelActions.ModelGetSuccessAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.GET_FAILURE:
    return {
      ...state,
      get: {
        ...state.get,
        loading: false,
        object: null,
        error: (<ModelActions.ModelGetFailureAction>action).payload.error
      }
    };

    case actionTypes.LIST:
    return {
      ...state,
      list: {
        ...state.list,
        loading: true,
        options: (<ModelActions.ModelListAction>action).payload.params,
        objects: null,
        error: null
      }
    };

    case actionTypes.LIST_SUCCESS:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
        objects: (<ModelActions.ModelListSuccessAction<M>>action).payload.result,
        error: null
      }
    };

    case actionTypes.LIST_FAILURE:
    return {
      ...state,
      list: {
        ...state.list,
        loading: false,
        objects: null,
        error: (<ModelActions.ModelListFailureAction>action).payload.error
      }
    };

    case actionTypes.CREATE:
    return {
      ...state,
      create: {
        ...state.create,
        loading: true,
        object: (<ModelActions.ModelCreateAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.CREATE_SUCCESS:
    return {
      ...state,
      create: {
        ...state.create,
        loading: false,
        object: (<ModelActions.ModelCreateSuccessAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.CREATE_FAILURE:
    return {
      ...state,
      create: {
        ...state.create,
        loading: false,
        object: null,
        error: (<ModelActions.ModelCreateFailureAction>action).payload.error
      }
    };

    case actionTypes.UPDATE:
    return {
      ...state,
      update: {
        ...state.update,
        loading: true,
        id: (<ModelActions.ModelUpdateAction<M>>action).payload.item.id,
        object: (<ModelActions.ModelUpdateAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.UPDATE_SUCCESS:
    return {
      ...state,
      update: {
        ...state.update,
        loading: false,
        object: (<ModelActions.ModelUpdateSuccessAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.UPDATE_FAILURE:
    return {
      ...state,
      update: {
        ...state.update,
        loading: false,
        object: null,
        error: (<ModelActions.ModelUpdateFailureAction>action).payload.error
      }
    };

    case actionTypes.PATCH:
    return {
      ...state,
      patch: {
        ...state.patch,
        loading: true,
        id: (<ModelActions.ModelPatchAction<M>>action).payload.item.id,
        object: (<ModelActions.ModelPatchAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.PATCH_SUCCESS:
    return {
      ...state,
      patch: {
        ...state.patch,
        loading: false,
        object: (<ModelActions.ModelPatchSuccessAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.PATCH_FAILURE:
    return {
      ...state,
      patch: {
        ...state.patch,
        loading: false,
        object: null,
        error: (<ModelActions.ModelPatchFailureAction>action).payload.error
      }
    };

    case actionTypes.DELETE:
    return {
      ...state,
      delete: {
        ...state.delete,
        loading: true,
        id: (<ModelActions.ModelDeleteAction<M>>action).payload.item.id,
        object: null,
        error: null
      }
    };

    case actionTypes.DELETE_SUCCESS:
    return {
      ...state,
      delete: {
        ...state.delete,
        loading: false,
        object: (<ModelActions.ModelDeleteSuccessAction<M>>action).payload.item,
        error: null
      }
    };

    case actionTypes.DELETE_FAILURE:
    return {
      ...state,
      delete: {
        ...state.delete,
        loading: false,
        object: null,
        error: (<ModelActions.ModelDeleteFailureAction>action).payload.error
      }
    };

    case actionTypes.DELETE_ALL:
    return {
      ...state,
      deleteAll: {
        ...state.deleteAll,
        loading: true,
        ids: (<ModelActions.ModelDeleteAllAction<M>>action).payload.items.map(i => i.id),
        objects: null,
        error: null
      }
    };

    case actionTypes.DELETE_ALL_SUCCESS:
    return {
      ...state,
      deleteAll: {
        ...state.deleteAll,
        loading: false,
        objects: (<ModelActions.ModelDeleteAllSuccessAction<M>>action).payload.items,
        error: null
      }
    };

    case actionTypes.DELETE_ALL_FAILURE:
    return {
      ...state,
      deleteAll: {
        ...state.deleteAll,
        loading: false,
        objects: null,
        error: (<ModelActions.ModelDeleteAllFailureAction>action).payload.error
      }
    };

    case actionTypes.QUERY:
    return {
      ...state,
      query: {
        ...state.list,
        loading: true,
        options: (<ModelActions.ModelQueryAction>action).payload.params,
        objects: null,
        error: null
      }
    };

    case actionTypes.QUERY_SUCCESS:
    return {
      ...state,
      query: {
        ...state.list,
        loading: false,
        options: {...state.query.options!},
        objects: (<ModelActions.ModelQuerySuccessAction<M>>action).payload.result,
        error: null
      }
    };

    case actionTypes.QUERY_FAILURE:
    return {
      ...state,
      query: {
        ...state.list,
        loading: false,
        options: {...state.query.options!},
        objects: null,
        error: (<ModelActions.ModelQueryFailureAction>action).payload.error
      }
    };

    default:
    return state;
  }
}
