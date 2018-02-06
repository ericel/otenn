
import { Action } from '@ngrx/store';
import { Comment } from '@collections/state/models/comment.model';

export const QUERY      = '[Comments] Query';

export const ADD_ALL    = '[Comments] Add All';
export const CREATE = '[Comment] Create';
export const UPDATE     = '[Comment] Update';
export const DELETE     = '[Comment] Delete';
export const SUCCESS    = '[Comment] Successful';
export const ERROR = '[Comment] Fail';
export const CREATE_SUCCESS = '[Comment] Successful';
/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handPage/advanced-types.html#discriminated-unions
 */
export class Query implements Action {
  readonly type = QUERY;
  constructor() { }
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public comments: Comment[]) { }
}

export class Success implements Action {
  readonly type = SUCCESS;
  constructor() {
  }
}

export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;
  constructor() {
  }
}

export class Fail implements Action {
  readonly type = ERROR;

  constructor(public payload: any) {
 }
}

export class Create implements Action {
  readonly type = CREATE;

  constructor(public comment: Comment) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type CommentActions
= Create
| Success
| CreateSuccess
| Delete
| Fail
| AddAll;
