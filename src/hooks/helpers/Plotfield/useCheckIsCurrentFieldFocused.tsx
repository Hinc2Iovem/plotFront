import useNavigation from "../../../features/Editor/Context/Navigation/NavigationContext";

type CheckIsCurrentFieldFocusedTypes = {
  plotFieldCommandId: string;
  setIsFocusedIf?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useCheckIsCurrentFieldFocused({ plotFieldCommandId }: CheckIsCurrentFieldFocusedTypes) {
  const { currentlyFocusedCommandId, setCurrentlyFocusedCommandId } = useNavigation();
  const focusedItem = sessionStorage.getItem("focusedCommand")?.split("-") || "";
  const focusedCommandId = focusedItem[1];

  // if (!currentlyFocusedCommandId?._id.trim().length) {
  //   setCurrentlyFocusedCommandId({
  //     currentlyFocusedCommandId: focusedCommandId,
  // TODO add check which checks if its an if command or not
  // isElse
  //   });
  // }
  return currentlyFocusedCommandId._id === plotFieldCommandId || focusedCommandId === plotFieldCommandId ? true : false;
}
