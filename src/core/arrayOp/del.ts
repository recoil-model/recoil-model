
export const del = (array) => (index) => {
  return index >= 0 ? [...array.slice(0, index), ...array.slice(index + 1)] : [...array];
}
