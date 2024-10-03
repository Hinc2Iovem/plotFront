import { useLayoutEffect, useState } from "react";

// MATCHMEDIA.Mobile usage

export default function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const matchQueryList = window.matchMedia(query);
    const handleChange = (e: {
      matches: boolean | ((prevState: boolean) => boolean);
    }) => {
      setMatches(e.matches);
    };
    matchQueryList.addEventListener("change", handleChange);
    handleChange(matchQueryList);
    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);
  return matches;
}
