import { Collection } from '@collections/state/models/collection.model';
import * as actions from '@collections/state/actions/collection.actions';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromApp from './../../../reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Collection> {
  success_create: boolean;
  loading: boolean;
  selectedCollectionId: string | null;
}
/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Collection> = createEntityAdapter<Collection>({
  selectId: (collection: Collection) => collection.id,
  sortComparer: false
});
/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
*/
export const initialState: State  = adapter.getInitialState({
  success_create: false,
  loading: false,
  selectedCollectionId: null,
});
// Reducer
export function collectionReducer(
  state: State = initialState,
  action: actions.CollectionActions) {

  switch (action.type) {
      case actions.ADD_ALL:
      //{ return adapter.addAll(action.collections, state)};
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(action.collections, state),
        selectedBookId: state.selectedCollectionId,
      };
      case actions.SUCCESS:
        { return {...state, loading: true}; }
      case actions.CREATE_SUCCESS:
        { return {...state, success_create: true}; }
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

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */
export const getLoading = (state: State) => state.loading;
export const getCreated = (state: State) => state.success_create;
export const getSelectedId = (state: State) => state.selectedCollectionId;
