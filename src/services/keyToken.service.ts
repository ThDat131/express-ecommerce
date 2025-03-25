import keytokenModel from '../models/keytoken.model';

class KeyTokenService {
  static readonly createToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
    refreshToken?: string;
  }): Promise<string | null> => {
    try {
      const tokens = await keytokenModel.findOneAndUpdate(
        { user: userId },
        { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        { upsert: true, new: true }
      );

      return tokens ? tokens.publicKey : null;
    } catch (err: any) {
      return err?.message;
    }
  };

  static readonly findByUserId = async ({ userId }: { userId: string }) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static readonly removeKeyById = async (id: string) => {
    return await keytokenModel.deleteOne({ _id: id }).lean();
  };

  static readonly findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static readonly findByRefreshToken = async (refreshToken: string) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  };

  static readonly deleteKeyByUserId = async (userId: string) => {
    return await keytokenModel.findOneAndDelete({ user: userId }).lean();
  };

  static readonly updateRefreshToken = async ({
    refreshToken,
    updatedRefreshToken,
  }: {
    refreshToken: string;
    updatedRefreshToken: string;
  }) => {
    return await keytokenModel.updateOne(
      { refreshToken },
      {
        $set: {
          refreshToken: updatedRefreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );
  };
}

export default KeyTokenService;
