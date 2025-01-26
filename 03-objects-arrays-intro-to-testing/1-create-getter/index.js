/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.');

  const result = (obj) => {
    let res = obj;

    for (let i = 0; i < pathArr.length; i += 1) {
      if (!res.hasOwnProperty(pathArr[i])) {
        return undefined;
      }
      res = res[pathArr[i]];
    }

    return res;
  }; 
  return result;
}
