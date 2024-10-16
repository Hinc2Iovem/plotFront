export const makeTopologyBlockName = ({
  name,
  amountOfOptions,
}: {
  name: string;
  amountOfOptions?: number;
}): string => {
  let newName;
  if (typeof amountOfOptions === "number") {
    newName = name + "-" + amountOfOptions;
  } else {
    return "";
  }
  return newName;
};
