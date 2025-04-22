export const generate = (length?: number): string => {
  if (typeof length === 'undefined' || length === null) {
    length = 1;
  }
  const l = length > 10 ? 10 : length;
  const str = Math.random().toString(36).substr(2, l);
  if (str.length >= length) {
    return str;
  }
  return str.concat(generate(length - str.length));
};
