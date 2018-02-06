
export class Comment {
  constructor(
  public id: string,
  public pageId: string,
  public comment: string,
  public collection: string,
  public createdAt: any,
  public collectionKey: string,
  public uid: string
  ) {}
}
