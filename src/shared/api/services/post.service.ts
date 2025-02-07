import { axiosAuth } from '@/src/core/lib/axios/config';
import { GetPostsType } from '@/src/shared/model/types/post.types';

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
};
