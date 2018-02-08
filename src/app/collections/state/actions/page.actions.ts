
import { Action } from '@ngrx/store';
import { Page } from '@collections/state/models/page.model';

export const QUERY      = '[Pages] Query';
export const SELECT = '[Collection] Get A Single Collection';

export const ADD_ALL    = '[Pages] Add All';
export const CREATE = '[Page] Create';
export const UPDATE     = '[Page] Update';
export const DELETE     = '[Page] Delete';
export const SUCCESS    = '[Page] Successful firestore write';
export const ERROR = '[Page] Fail';
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
  constructor(public pages: Page[]) { }
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

  constructor(public page: Page) {}
}


export class Update implements Action {
  readonly type = UPDATE;
  constructor(
      public id: string,
      public changes: Partial<Page>,
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

export type PageActions
= Create
| Success
| CreateSuccess
| Update
| Delete
| Fail
| Select
| AddAll;
