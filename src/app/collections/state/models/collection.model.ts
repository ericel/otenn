
export class CollectionComponents {
  constructor(
  public pages: boolean,
  public videos: boolean,
  public photos: boolean,
  public forums: boolean,
 ) {}
}


export class Collection {
  constructor(
  public id: string,
  public title: string,
  public description: string,
  public photoURL: string,
  public status: string,
  public components: CollectionComponents,
  public createdAt: any,
  public updatedAt: any,
  public homepage: string,
  public admins: object,
  public color: string,
  public uid: string ) {}
}

