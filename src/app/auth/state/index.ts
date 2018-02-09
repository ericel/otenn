import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as fromAuth from 'app/auth/state/auth.reducer';
import { authReducer } from 'app/auth/state/auth.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromStore from '../../reducers';
export interface AuthState {
  status: fromAuth.State;
}

export interface State{
  auth: AuthState;
}

export const reducers = {
  status: fromAuth.authReducer,
};

export const AuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthStatusState = createSelector(
  AuthState,
  (state: AuthState) => state.status
);
export const getLoggedIn = createSelector(selectAuthStatusState, fromAuth.getAuthenticated);
export const getUser = createSelector(selectAuthStatusState, fromAuth.getUser);
