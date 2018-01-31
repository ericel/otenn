import { Collection } from '@collections/state/collections.model';
import * as actions from '@collections/state/collections.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

export const collectionAdapter = createEntityAdapter<Collection>({
  selectId: (collection: Collection) => collection.$key,
});
export interface State extends EntityState<Collection> { }

const defaultCollection = {
  ids: ['83nryus'],
  entities: {
      '83nryus': {
        $key: '83nryus',
        title: 'Frequently Asked Questions',
        description: 'F.A.Q answered here for this service.',
        photoURL: 'https://www.w3schools.com/bootstrap4/paris.jpg',
        status: 'On queue waiting..collection admin',
        items: {forums: true, pages: true, photos: true, videos: true},
        createdAt: '2018-01-30 01:30:20',
        updatedAt: '2018-01-30 01:30:20',
        admins: ['494949393'],
        color: '#8c6d62',
        uid: 'ez447krz'
      }
  }
}

export const initialState: State = collectionAdapter.getInitialState();

// Reducer
export function collectionReducer(
    state: State = initialState,
    action: actions.CollectionActions) {

    switch (action.type) {

        case actions.ADD_ALL:
            return collectionAdapter.addAll(action.collections, state);


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
  } = collectionAdapter.getSelectors(getCollectionState);
