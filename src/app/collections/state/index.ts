import { createSelector, createFeatureSelector } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';
import * as fromCollections from '@collections/state/reducers/collection.reducer';
import * as fromPages from '@collections/state/reducers/page.reducer';
import * as fromRoot from './../../reducers/index';
export interface CollectionsState {
  collection: fromCollections.State;
  pages: fromPages.State;
}

export interface State {
  collection: CollectionsState;
}

export const reducers = {
  collections: fromCollections.collectionReducer,
  pages: fromPages.pageReducer,
};

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getCollectionState = createFeatureSelector<CollectionsState>('collections');
