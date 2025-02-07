import { ProfileType } from '@/src/shared/model/types/profile.types';

export type PostType = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  profileId: string;
  profile: ProfileType;
};

export type GetPostsType = {
  posts: PostType[];
  nextCursor: string | null;
};
