import * as actions from '@collections/state/actions/replyforum.actions';
import { ReplyForum } from '@collections/state/models/forum.model';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';


export interface State extends EntityState<ReplyForum> {
  success_reply: boolean;
  loading: boolean;
}

export const adapter: EntityAdapter<ReplyForum> = createEntityAdapter<ReplyForum>({
  selectId: (replyforum: ReplyForum) => replyforum.id,
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  success_reply: false,
  loading: false
});

// Reducer
export function replyforumReducer(
    state: State = initialState,
    action: actions.ReplyForumActions) {

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
              ...adapter.addAll(action.replyforums, state)
            };
        case actions.SUCCESS:
            { return {...state, loading: true, success_reply: true}; }
        case actions.CREATE_SUCCESS:
            { return {...state, loading: false, success_reply: true}; }
        default:
            return state;
        }

}

// Create the default selectors
export const getLoading = (state: State) => state.loading;
export const getCreated = (state: State) => state.success_reply;
