
export const unshift = (array) => (...elementN) => {
  return [...elementN, ...array];
}
