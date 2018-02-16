import { ForumCreator } from '@collections/collection/forums/shared/forum-creator';
import { ReplyCreator } from '@collections/collection/forums/shared/reply-creator';
import { ForumReplyComponent } from '@collections/collection/forums/forum/forum-reply/forum-reply.component';
import { ForumEditor } from '@collections/collection/forums/shared/forum-editor';

export const FORUM_ADDONS = [
  ForumCreator,
  ReplyCreator,
  ForumReplyComponent,
  ForumEditor
]
