import modelShop from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair, verifyJWT } from '../auth/authUtils';
import { getInfoData } from '../utils';
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenRequestError,
} from '../core/error.response';
import { findByEmail } from './shop.service';
import type { KeyTokenType } from '../models/keytoken.model';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static readonly handleRefreshToken = async (refreshToken: string) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey);

      console.log({ userId, email });

      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenRequestError(
        'Something wrong happened. Please re-signin'
      );
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop is not registered!');

    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop is not registered!');

    const tokens = await createTokenPair(
      { userId: String(foundShop._id), email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await KeyTokenService.updateRefreshToken({
      refreshToken,
      updatedRefreshToken: tokens?.refreshToken ?? '',
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static readonly signIn = async ({
    email,
    password,
    refreshToken = null,
  }: {
    email: string;
    password: string;
    refreshToken: string | null;
  }) => {
    const existedShop = await findByEmail({ email });
    if (!existedShop) throw new BadRequestError('Shop is not registered');

    const match = await bcrypt.compare(password, existedShop.password);
    if (!match) throw new AuthFailureError('Authentication error');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair(
      { userId: String(existedShop._id), email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createToken({
      userId: String(existedShop._id),
      refreshToken: tokens?.refreshToken ?? '',
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: existedShop,
      }),
      tokens,
    };
  };

  static readonly signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const existedShop = await modelShop.findOne({ email }).lean();

    if (existedShop) {
      throw new BadRequestError('Error: Shop already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await modelShop.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      const publicKeyString = await KeyTokenService.createToken({
        userId: String(newShop._id),
        publicKey,
        privateKey,
      });

      if (!publicKeyString)
        return {
          code: 'xxx',
          message: 'publicKeyString error',
        };

      const tokens = await createTokenPair(
        { userId: String(newShop._id), email },
        publicKeyString,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static readonly signOut = async ({
    keyStore,
  }: {
    keyStore: KeyTokenType | undefined;
  }) => {
    if (!keyStore) return;

    return await KeyTokenService.removeKeyById(keyStore._id);
  };
}

export default AccessService;
