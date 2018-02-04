import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as fromPizza from 'app/pizza/pizza.reducer'
import { pizzaReducer } from 'app/pizza/pizza.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  pizza: fromPizza.State;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  pizza: fromPizza.pizzaReducer
};
