
export class Forum {
  constructor(
  public id: string,
  public title: string,
  public description: string,
  public status: string,
  public collection: string,
  public component: string,
  public createdAt: any,
  public updatedAt: any,
  public collectionKey: string,
  public uid: string ) {}
}

export class ReplyForum {
  constructor(
  public id: string,
  public reply: string,
  public createdAt: any,
  public forumId: string,
  public uid: string ) {}
}

