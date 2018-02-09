
import { Action } from '@ngrx/store';
import { Forum } from '@collections/state/models/forum.model';

export const QUERY      = '[Forums] Query';
export const SELECT = '[Collection] Get A Single Collection';

export const ADD_ALL    = '[Forums] Add All';
export const CREATE = '[Forum] Create';
export const UPDATE     = '[Forum] Update';
export const DELETE     = '[Forum] Delete';
export const SUCCESS    = '[Forum] Successful firestore write';
export const ERROR = '[Forum] Fail';
export const CREATE_SUCCESS = '[Comment] Successful firestore write';
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
export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: string) {}
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public forums: Forum[]) {
  }
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
  //success_create = false;
  constructor(public payload: any) {
 }
}

export class Create implements Action {
  readonly type = CREATE;

  constructor(public forum: Forum) {}
}


export class Update implements Action {
  readonly type = UPDATE;
  constructor(
      public id: string,
      public changes: Partial<Forum>,
    ) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type ForumActions
= Create
| Success
| CreateSuccess
| Update
| Delete
| Fail
| Select
| AddAll;
