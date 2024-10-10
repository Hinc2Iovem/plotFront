export const makeTopologyBlockName = ({
  name,
  amountOfOptions,
}: {
  name: string;
  amountOfOptions?: number;
}): string => {
  let newName;
  if (typeof amountOfOptions === "number") {
    if (name?.includes("-")) {
      const newArray = name.split("-");
      newName = newArray[0] + "-" + (Number(newArray[1]) + 1);
    } else {
      newName = name + "-" + amountOfOptions;
    }
  } else {
    return "";
  }
  return newName;
};
