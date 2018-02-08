import * as actions from '@collections/state/actions/comment.actions';
import { Comment } from '@collections/state/models/comment.model';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';


export interface State extends EntityState<Comment> {
  success_comment: boolean;
  loading: boolean;
}

export const adapter: EntityAdapter<Comment> = createEntityAdapter<Comment>({
  selectId: (comment: Comment) => comment.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  success_comment: false,
  loading: false
});

// Reducer
export function commentReducer(
    state: State = initialState,
    action: actions.CommentActions) {

    switch (action.type) {
        case actions.ADD_ALL:
            return {
              /**
               * The addMany function provided by the created adapter
               * adds many records to the entity dictionary
               * and returns a new state including those records. If
               * the collection is to be sorted, the adapter will
               * sort each record upon entry into the sorted array.
               */
              ...adapter.addAll(action.comments, state)
            };
        case actions.SUCCESS:
            { return {...state, loading: true, success_comment: true}; }
        case actions.CREATE_SUCCESS:
            { return {...state, loading: false, success_comment: true}; }
        default:
            return state;
        }

}

// Create the default selectors
export const getLoading = (state: State) => state.loading;
export const getCreated = (state: State) => state.success_comment;
