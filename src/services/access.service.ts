import modelShop from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { getInfoData } from '../utils';

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
    try {
      const existedShop = await modelShop.findOne({ email }).lean();

      if (existedShop) {
        return {
          code: 'xxx',
          message: 'Shop already register',
        };
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
    } catch (err: any) {
      return {
        code: 'xxx',
        message: err.message,
        status: 'error',
      };
    }
  };
}

export default AccessService;
