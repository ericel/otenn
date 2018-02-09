import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as fromPizza from 'app/pizza/pizza.reducer'
import { pizzaReducer } from 'app/pizza/pizza.reducer';
import * as fromAuth from 'app/auth/state/auth.reducer';
import { authReducer } from 'app/auth/state/auth.reducer';


export interface State {
  pizza: fromPizza.State;
  auth: fromAuth.State;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
//pizza: fromPizza.pizzaReducer,
export const reducers: ActionReducerMap<State> = {
  pizza: fromPizza.pizzaReducer,
  auth: fromAuth.authReducer

};
