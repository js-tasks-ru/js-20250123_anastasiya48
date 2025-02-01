/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  const stringArr = [];
  const count = size ?? string.length;
  let j = 0;

  for (let i = 0; i < string.length; i += 1) {
    if (string[i - 1] !== string[i]) {
      stringArr.push(string[i]);
      j = 1;
      continue;
    }
    if (string[i - 1] === string[i] && j < count) {
      stringArr.push(string[i]);
      j += 1;
    } 
  }

  return stringArr.join('');
}
