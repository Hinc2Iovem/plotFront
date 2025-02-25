import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import React from "react";

type StayLoggedInTypes = {
  stayLoggedIn: boolean;
  setStayLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StayLoggedIn({ setStayLoggedIn, stayLoggedIn }: StayLoggedInTypes) {
  return (
    <div className="gap-[5px] flex items-center self-end">
      <HoverCard>
        <HoverCardTrigger className="text-[13px] text-paragraph opacity-60 hover:opacity-100 transition-opacity">
          Остаться залогиненным?
        </HoverCardTrigger>
        <HoverCardContent className="text-paragraph text-[12px] left-0 border-border border-[1px] bg-secondary px-[10px] w-[200px] py-[10px] rounded-sm z-[10]">
          <span className="opacity-70">Вам больше не нужно будет логиниться на этом устройстве</span>
        </HoverCardContent>
      </HoverCard>
      <Checkbox checked={stayLoggedIn} onClick={() => setStayLoggedIn((prev) => !prev)} />
    </div>
  );
}
