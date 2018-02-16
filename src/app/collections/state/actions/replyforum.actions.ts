
import { Action } from '@ngrx/store';
import { ReplyForum } from '@collections/state/models/forum.model';

export const QUERY      = '[replyforums] Query';

export const ADD_ALL    = '[replyforums] Add All';
export const CREATE = '[replyforum] Create';
export const UPDATE     = '[replyforum] Update';
export const DELETE     = '[replyforum] Delete';
export const SUCCESS    = '[replyforum] Successful';
export const ERROR = '[replyforum] Fail';
export const CREATE_SUCCESS = '[replyforum] Successful';
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
  constructor(public replyforums: ReplyForum[]) { }
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

  constructor(public replyforum: ReplyForum) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type ReplyForumActions
= Create
| Success
| CreateSuccess
| Delete
| Fail
| AddAll;
