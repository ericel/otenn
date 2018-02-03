
import { Action } from '@ngrx/store';
import { Page } from '@collections/state/models/page.model';

export const QUERY      = '[Pages] Query';

export const ADD_ALL    = '[Pages] Add All';
export const CREATE = '[Page] Create';
export const SUCCESS    = '[Page] Successful firestore write';
export const ERROR = '[Page] Fail';

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
  constructor(public pages: Page[]) { }
}

export class Success implements Action {
  readonly type = SUCCESS;
  constructor() {
    console.log('true');
   }
}


export class Fail implements Action {
  readonly type = ERROR;

  constructor(public payload: any) {
 }
}

export class Create implements Action {
  readonly type = CREATE;

  constructor(public page: Page) {}
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type PageActions
= Create
| AddAll;
