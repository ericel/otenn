
export class CollectionItems {
  constructor(
  public blog: boolean,
  public videos: boolean,
  public photos: boolean,
  public forum: boolean,
 ) {}
}


export class Collection {
  constructor(
  public $key: string,
  public title: string,
  public description: string,
  public photoURL: string,
  public status: string,
  public items: CollectionItems,
  public createdAt: any,
  public updatedAt: any,
  public admins: object,
  public color: string,
  public uid: string ) {}
}

