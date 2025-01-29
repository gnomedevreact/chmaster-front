import { AxiosError } from 'axios';

export function formatError(
  error: { data: { message: string | string[] } } | AxiosError<any, any>['response'],
) {
  if (!error) return null;

  return typeof error?.data.message === 'string'
    ? error.data.message
    : error?.data.message[0];
}
