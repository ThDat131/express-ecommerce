import apiKeyModel from '../models/apiKey.model';

export const findById = async (key: string) => {
  return apiKeyModel.findOne({ key, status: true }).lean();
};
