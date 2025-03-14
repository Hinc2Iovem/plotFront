export function removeElementAtIndex<T>({ array, index }: { array: T[]; index: number }) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
