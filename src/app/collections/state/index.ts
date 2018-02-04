import { createSelector, createFeatureSelector } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';
import * as fromCollections from '@collections/state/reducers/collection.reducer';
import * as fromPages from '@collections/state/reducers/page.reducer';
import * as fromRoot from './../../reducers/index';
import { adapter } from '@collections/state/reducers/page.reducer';

export interface CollectionsState {
  collections: fromCollections.State;
  pages: fromPages.State;
}

export interface State extends fromRoot.State {
  collections: CollectionsState;
}

export const reducers = {
  collection: fromCollections.collectionReducer,
  page: fromPages.pageReducer
};


export const getCollectionsState = createFeatureSelector<CollectionsState>('collections');

export const getCollectionEntitiesState = createSelector(
  getCollectionsState,
  state => state.collections
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = fromCollections.adapter.getSelectors(getCollectionEntitiesState);
