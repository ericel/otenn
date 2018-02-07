import { Page } from '@collections/state/models/page.model';
import * as actions from '@collections/state/actions/page.actions';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Page> {
  success_create: boolean;
  loading: boolean;
}

export const adapter: EntityAdapter<Page> = createEntityAdapter<Page>({
  selectId: (page: Page) => page.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  success_create: false,
  loading: false
});

// Reducer
export function pageReducer(
    state: State = initialState,
    action: actions.PageActions) {

    switch (action.type) {
        case actions.ADD_ALL:
            return adapter.addAll(action.pages, state);
        case actions.SUCCESS:
        { return {...state, loading: true, success_create: false}};
        case actions.CREATE_SUCCESS:
        { return {...state, loading: false, success_create: true}};
        case actions.ERROR:
        { return {...state, loading: true, success_create: false}};
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
  } = adapter.getSelectors(getPageState);
  export const getLoading = createSelector(
    getPageState,
    (state: State) => state.loading
);
export const getSuccessPage = createSelector(
    getPageState,
    (state: State) => state.success_create
  );

