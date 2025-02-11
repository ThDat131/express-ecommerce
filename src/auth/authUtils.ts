import JWT from 'jsonwebtoken';
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
