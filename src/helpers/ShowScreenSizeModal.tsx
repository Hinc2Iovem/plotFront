import { useEffect, useState } from "react";

export default function ShowScreenSizeModal() {
  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else if (width < 1536) setBreakpoint("xl");
      else setBreakpoint("2xl");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-800 px-3 py-1 text-sm text-text-dark">
      {breakpoint}
    </div>
  );
}
