import { Action } from '@ngrx/store';
import { Collection } from '@collections/state/collections.model';
export const CREATE     = '[Collections] Create';
export const UPDATE     = '[Collections] Update';
export const DELETE     = '[Collections] Delete';

export const QUERY      = '[Collections] Query';
export const ADD_ALL    = '[Collections] Add All';
export const SUCCESS    = '[Collections] Successful firestore write';


export class Query implements Action {
  readonly type = QUERY;
  constructor() { }
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public collections: Collection[]) { }
}

export class Success implements Action {
  readonly type = SUCCESS;
  constructor() { }
}


export class Create implements Action {
  readonly type = CREATE;
  constructor(public collection: Collection) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(
      public id: string,
      public changes: Partial<Collection>,
    ) { }
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}

export type CollectionActions
= Create
| Update
| Delete
| Query
| AddAll;
