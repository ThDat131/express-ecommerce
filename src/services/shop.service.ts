import type { ProjectionType } from 'mongoose';
import shopModel, { type ShopType } from '../models/shop.model';

const findByEmail = async ({
  email,
  projection = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
}: {
  email: string;
  projection?: ProjectionType<ShopType>;
}) => {
  return await shopModel.findOne({ email }, projection).lean();
};

export { findByEmail };
