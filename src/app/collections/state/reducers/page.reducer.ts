import { Page } from '@collections/state/models/page.model';
import * as actions from '@collections/state/actions/page.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

export const pageAdapter = createEntityAdapter<Page>({
  //selectId: (collection: Collection) => collection.id,
});


export interface CheckState {
  success_create: false
}

export interface State extends EntityState<Page> {}

const defaultPage = {
    ids: ['kHnryus'],
    entities: {
        'kHnryus': {
        id: '83nryus',
        title: 'How to create a blog with Angular4 Ngrx',
        description: 'How to create a blog with Angular4 Ngrx',
        page: 'How to create a blog with Angular4 Ngrx',
        photoURL: '../assets/img/page.png',
        status: 'Waiting collection admin',
        collection: 'Angular',
        component: 'pages',
        createdAt: '2018-01-30 01:30:20',
        updatedAt: '2018-01-30 01:30:20',
        collectionKey: 'gdnryus',
        uid: 'gdnrserrs'
    }
  }
}

export const initialState: State = pageAdapter.getInitialState();

// Reducer
export function pageReducer(
    state: State = initialState,
    action: actions.PageActions) {

    switch (action.type) {
        case actions.ADD_ALL:
            return pageAdapter.addAll(action.pages, state);

        default:
            return state;
        }

}

// Create the default selectors
export const getPageState = createFeatureSelector<State>('page');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = pageAdapter.getSelectors(getPageState);
