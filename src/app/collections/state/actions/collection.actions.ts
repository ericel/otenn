import { Action } from '@ngrx/store';
import { Collection } from '@collections/state/models/collection.model';
import { NotifyService } from '@shared/services/notify.service';
export const CREATE     = '[Collections] Create';
export const UPDATE     = '[Collections] Update';
export const DELETE     = '[Collections] Delete';
export const ERROR = '[Collection] Remove Collection Fail';

export const QUERY      = '[Collections] Query';


export const ADD_ALL    = '[Collections] Add All';
export const SUCCESS    = '[Collections] Successful firestore write';
export const QUERY_COLLECTION = '[Collection] Get A Single Collection';
export const SELECT = '[Collection] Get A Single Collection';
export const CREATE_SUCCESS = '[Comment] Successful firestore write';

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
  constructor(public collections: Collection[]) { }
}

export class Success implements Action {
  readonly type = SUCCESS;
  loading = true;
  constructor() {}
}

export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;
  success_create = true;
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
  constructor(public collection: Collection) { }
}

export class Update implements Action {
  readonly type = UPDATE;
  constructor(
      public id: string,
      public changes: Partial<Collection>,
    ) {}
}

export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) { }
}



export type CollectionActions
= Create
| Update
| Delete
| Success
| CreateSuccess
| Query
| Select
| AddAll;
