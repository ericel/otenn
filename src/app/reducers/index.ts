import { ActionReducerMap } from '@ngrx/store';
import { collectionReducer } from '@collections/state/collections.reducer';

export const reducers: ActionReducerMap<any> = {
    collection: collectionReducer
};
