import modelShop from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { getInfoData } from '../utils';
import { BadRequestError } from '../core/error.response';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
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
}

export default AccessService;
