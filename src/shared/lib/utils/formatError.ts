import { AxiosError } from 'axios';

export function formatError(
  error: { data: { message: string | string[] } } | AxiosError<any, any>['response'],
) {
  if (!error) return 'Something went wrong';

  return typeof error?.data.message === 'string'
    ? error.data.message
    : error?.data.message[0];
}
