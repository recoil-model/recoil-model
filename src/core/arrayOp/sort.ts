export const sort = (array) => (compareFunction) => {
  return [...array].sort(compareFunction);
}
