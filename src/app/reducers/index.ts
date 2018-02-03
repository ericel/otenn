import { ActionReducerMap } from '@ngrx/store';
import { collectionReducer } from '@collections/state/reducers/collection.reducer';
import { pageReducer } from '@collections/state/reducers/page.reducer';
import { pizzaReducer } from 'app/pizza/pizza.reducer';
import * as fromPizza from 'app/pizza/pizza.reducer'
export const reducers: ActionReducerMap<any> = {
  collection: collectionReducer,
  page: pageReducer,
  pizza: pizzaReducer
};
