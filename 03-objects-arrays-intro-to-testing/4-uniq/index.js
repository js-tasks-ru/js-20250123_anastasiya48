/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const result = new Set();

  if (arr !== undefined) {
    arr.forEach(el => result.add(el));
  }

  return Array.from(result);
}
