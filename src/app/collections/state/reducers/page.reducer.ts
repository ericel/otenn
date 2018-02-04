import { Page } from '@collections/state/models/page.model';
import * as actions from '@collections/state/actions/page.actions';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Page> {
  success_create: boolean;
}

export const adapter: EntityAdapter<Page> = createEntityAdapter<Page>({
  selectId: (page: Page) => page.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  success_create: false,
});

// Reducer
export function pageReducer(
    state: State = initialState,
    action: actions.PageActions) {

    switch (action.type) {
        case actions.ADD_ALL:
            return adapter.addAll(action.pages, state);
        case actions.SUCCESS: {
            return {success_create: true}
        };
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

export const getSuccessCreate = createSelector(
    getPageState,
    (state: State) => state.success_create
  );
