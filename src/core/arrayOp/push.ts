
export const push = <T>(...elementN: T[]) => (array: T[]) => {
  return [...array, ...elementN];
}
