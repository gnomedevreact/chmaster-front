import { axiosAuth } from '@/src/core/lib/axios/config';
import { GetPostsType } from '@/src/shared/model/types/post.types';
import {
  CreateCommentType,
  GetCommentsType,
} from '@/src/shared/model/types/comment.types';

export const PostService = {
  async createPost(formData: FormData) {
    return await axiosAuth.post('/post/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getPosts(cursor: string | null) {
    return await axiosAuth.get<GetPostsType>('/post', {
      params: {
        cursor,
      },
    });
  },

  async addComment(data: CreateCommentType) {
    return await axiosAuth.post('/post/comment', data);
  },

  async getComments({ postId, cursor }: { postId: string; cursor: string | null }) {
    return await axiosAuth.get<GetCommentsType>(`/post/comments/${postId}`, {
      params: {
        cursor,
      },
    });
  },
};
