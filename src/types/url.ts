import { Request, Response } from 'express';
export interface Req extends Request {
  route: { path: string };
  baseUrl: string;
}

export interface Res extends Response {
  statusCode: number;
}
