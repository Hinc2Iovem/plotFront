import { useEffect, useRef, useState } from "react";

export default function useFindoutWidthOfContainer(): { ref: React.RefObject<HTMLDivElement>; width: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.clientWidth);
  }, [ref]);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;

      setWidth(ref.current.clientWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { ref, width };
}
