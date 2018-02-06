import { Collection } from '@collections/state/models/collection.model';
import * as actions from '@collections/state/actions/collection.actions';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends EntityState<Collection> {
  success_create: boolean;
  loading: boolean;
}

export const adapter: EntityAdapter<Collection> = createEntityAdapter<Collection>({
  selectId: (collection: Collection) => collection.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  success_create: false,
  loading: false
});
// Reducer
export function collectionReducer(
  state: State = initialState,
  action: actions.CollectionActions) {

  switch (action.type) {
      case actions.ADD_ALL:
         { return adapter.addAll(action.collections, state)};
      case actions.SUCCESS:
        { return {...state, loading: true}; };
      case actions.CREATE_SUCCESS:
        { return {...state, success_create: true}; }
      default:
          return state;
      }

}

// Create the default selectors
export const getCollectionState = createFeatureSelector<State>('collection');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getCollectionState);

export const getSuccessCollection = createSelector(
  getCollectionState,
  (state: State) => state.success_create
);
export const getLoading = createSelector(
  getCollectionState,
  (state: State) => state.loading
);
