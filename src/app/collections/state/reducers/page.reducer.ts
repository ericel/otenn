import { Page } from '@collections/state/models/page.model';
import * as actions from '@collections/state/actions/page.actions';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromApp from './../../../reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Page> {
  success_create: boolean;
  loading: boolean;
  selectedPageId: string | null;
}
/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Page> = createEntityAdapter<Page>({
  selectId: (page: Page) => page.id,
  sortComparer: false
});
/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
*/
export const initialState: State  = adapter.getInitialState({
  success_create: false,
  loading: false,
  selectedPageId: null,
});

// Reducer
export function pageReducer(
    state: State = initialState,
    action: actions.PageActions) {

    switch (action.type) {
        case actions.ADD_ALL:
           // return adapter.addAll(action.pages, state);
            return {
              /**
               * The addMany function provided by the created adapter
               * adds many records to the entity dictionary
               * and returns a new state including those records. If
               * the collection is to be sorted, the adapter will
               * sort each record upon entry into the sorted array.
               */
              ...adapter.addAll(action.pages, state),
              selectedBookId: state.selectedPageId,
            };
        case actions.SUCCESS:
        { return {...state, loading: true, success_create: false}};
        case actions.CREATE_SUCCESS:
        { return {...state, loading: false, success_create: true}};
        case actions.ERROR:
        { return {...state, loading: true, success_create: false}};
        case actions.SELECT: {
          return {
            ...state,
            selectedCollectionId: action.payload,
          };
        }
        default:
            return state;
        }

}

export const getLoading = (state: State) => state.loading;
export const getCreated = (state: State) => state.success_create;
export const getSelectedId = (state: State) => state.selectedPageId;
