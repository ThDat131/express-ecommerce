import keytokenModel from '../models/keytoken.model';

class KeyTokenService {
  static readonly createToken = async ({
    userId,
    publicKey,
    privateKey,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
  }): Promise<string | null> => {
    try {
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (err: any) {
      return err?.message;
    }
  };
}

export default KeyTokenService;
