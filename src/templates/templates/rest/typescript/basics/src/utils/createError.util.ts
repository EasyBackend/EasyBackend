export const createError = (msg: string, status: number) => {
  throw { customMessage: msg, status };
};
