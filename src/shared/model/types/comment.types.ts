import { ProfileType } from '@/src/shared/model/types/profile.types';
import { PostType } from '@/src/shared/model/types/post.types';

export type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  profileId: string;
  postId: string;
  parentId: string;
  profile: ProfileType;
  post: PostType;
  parent: CommentType;
  replies: CommentType[];
};

export type CreateCommentType = {
  content: string;
  postId: string;
  parentId?: string;
};

export type GetCommentsType = {
  comments: CommentType[];
  nextCursor: string | null;
};
