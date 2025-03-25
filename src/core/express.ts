import type { KeyTokenType } from '../models/keytoken.model';

declare module 'express' {
  export interface Request {
    keyStore?: KeyTokenType;
  }
}
