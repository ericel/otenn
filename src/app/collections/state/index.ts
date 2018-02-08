import { createSelector, createFeatureSelector } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';
import * as fromCollections from '@collections/state/reducers/collection.reducer';
import * as fromPages from '@collections/state/reducers/page.reducer';
import * as fromRoot from './../../reducers';
import { adapter } from '@collections/state/reducers/page.reducer';
import { commentReducer } from '@collections/state/reducers/comment.reducer';
import * as fromComments from '@collections/state/reducers/comment.reducer';

export interface CollectionsState {
  collections: fromCollections.State;
  pages: fromPages.State;
  comments: fromComments.State;
}

export interface State extends fromRoot.AppState {
  collections: CollectionsState;
}

export const reducers = {
  collections: fromCollections.collectionReducer,
  pages: fromPages.pageReducer,
  comments: fromComments.commentReducer
};

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
*/
export const getCollectionsState = createFeatureSelector<CollectionsState>('collections');
/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const getCollectionEntitiesState = createSelector(
  getCollectionsState,
  state => state.collections
);
export const getSelectedCollectionId = createSelector(
  getCollectionEntitiesState,
  fromCollections.getSelectedId
);
/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reducers boilerplate
 * in selecting records from the entity state.
 */
export const getCollectionState = createSelector(
  getCollectionsState,
  (state: CollectionsState) => state.collections
);

export const getLoading = createSelector(
  getCollectionState,
  fromCollections.getLoading
);
export const getSuccessCollection = createSelector(
  getCollectionState,
  fromCollections.getCreated
);

export const {
  selectIds: getCollectionIds,
  selectEntities: getCollectionEntities,
  selectAll: getAllCollections,
  selectTotal: getTotalCollections,
} = fromCollections.adapter.getSelectors(getCollectionEntitiesState);

export const getSelectedCollection = createSelector(
  getCollectionEntities,
  getSelectedCollectionId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);
/**
 * Just like with the books selectors, we also have to compose the page
 * reducer's and collection reducer's selectors.
 */

export const getPagesEntitiesState = createSelector(
  getCollectionsState,
  state => state.pages
);
export const getSelectedPageId = createSelector(
  getPagesEntitiesState,
  fromPages.getSelectedId
);
/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reducers boilerplate
 * in selecting records from the entity state.
 */
export const getPageState = createSelector(
  getCollectionsState,
  (state: CollectionsState) => state.pages
);

export const getLoadingPage = createSelector(
  getPageState,
  fromPages.getLoading
);
export const getSuccessPage = createSelector(
  getPageState,
  fromPages.getCreated
);

export const {
  selectIds: getPageIds,
  selectEntities: getPageEntities,
  selectAll: getAllPages,
  selectTotal: getTotalPages,
} = fromPages.adapter.getSelectors(getPagesEntitiesState);

export const getSelectedPage = createSelector(
  getPageEntities,
  getSelectedPageId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);

/**
 * Just like with the books selectors, we also have to compose the Comments
 * reducer's and collection reducer's selectors.
 */

export const getCommentsEntitiesState = createSelector(
  getCollectionsState,
  state => state.comments
);

/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reducers boilerplate
 * in selecting records from the entity state.
 */
export const getCommentState = createSelector(
  getCollectionsState,
  (state: CollectionsState) => state.comments
);

export const getLoadingComment = createSelector(
  getCommentState,
  fromComments.getLoading
);
export const getSuccessComment = createSelector(
  getCommentState,
  fromComments.getCreated
);

export const {
  selectIds: getCommentIds,
  selectEntities: getCommentEntities,
  selectAll: getAllComments,
  selectTotal: getTotalComments,
} = fromComments.adapter.getSelectors(getCommentsEntitiesState);

