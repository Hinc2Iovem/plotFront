// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkObjectsIdenticalShallow<T extends Record<string, any>>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]);
}
