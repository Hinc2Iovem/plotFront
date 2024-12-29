import useNavigation from "../../../Context/Navigation/NavigationContext";

export default function useGetCurrentFocusedElement() {
  const currentlyFocusedCommandId = useNavigation((state) => state.currentlyFocusedCommandId);

  return currentlyFocusedCommandId;
}
