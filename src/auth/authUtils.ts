import JWT from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandler';
import { AuthFailureError, NotFoundError } from '../core/error.response';
import KeyTokenService from '../services/keyToken.service';
import type { JWTPayload } from '../core/common.type';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

export const createTokenPair = async (
  payload: any,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.error('Error on verify: ', err);
      else console.log('Decode verify: ', decode);
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (err) {}
};

export const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();

  if (!userId) throw new AuthFailureError('Invalid request');

  const keyStore = await KeyTokenService.findByUserId({ userId });

  if (!keyStore) throw new NotFoundError('Not found keystore');

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();

  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    const userIdDecode = (decodeUser as JWT.JwtPayload)?.userId;

    if (userId !== userIdDecode) throw new AuthFailureError('Invalid userId');

    req.keyStore = keyStore;

    return next();
  } catch (err) {
    throw err;
  }
});

export const verifyJWT = (token: string, keySecret: string): JWTPayload => {
  return JWT.verify(token, keySecret) as unknown as JWTPayload;
};
