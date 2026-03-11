export const isObjEmpty = (obj: unknown) => {
  return obj != null && Object.keys(obj).length === 0;
};
