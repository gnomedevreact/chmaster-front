import { AxiosError } from 'axios';

export type ErrorType =
  | { data: { message: string | string[] } }
  | AxiosError<any, any>['response'];
