import { pick } from 'lodash-es';

export const getInfoData = <T>({
  fields = [],
  object,
}: {
  fields: (keyof T)[];
  object: T;
}) => {
  return pick(object, fields);
};
