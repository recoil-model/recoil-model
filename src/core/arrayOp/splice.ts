
export const splice = (array) => (start = array.length, deleteCount = array.length - start, ...elementN) => {
  return [
    ...array.slice(0, start),
    ...elementN,
    ...array.slice(start + (deleteCount < 0 ? 0 : deleteCount))
  ];
}
