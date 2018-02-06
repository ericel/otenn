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
            return adapter.addAll(action.comments, state);
        case actions.SUCCESS:
            { return {...state, loading: true, success_comment: true}; }
        case actions.CREATE_SUCCESS:
            { return {...state, loading: false, success_comment: true}; }
        default:
            return state;
        }

}

// Create the default selectors
export const getCommentState = createFeatureSelector<State>('comment');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = adapter.getSelectors(getCommentState);
  export const getLoading = createSelector(
    getCommentState,
    (state: State) => state.loading
  );
export const getSuccessComment = createSelector(
    getCommentState,
    (state: State) => state.success_comment
  );

