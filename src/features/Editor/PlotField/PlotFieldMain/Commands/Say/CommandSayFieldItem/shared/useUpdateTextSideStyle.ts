import { useEffect } from "react";
import useUpdateSayTextSide from "../../../../../hooks/Say/patch/useUpdateSayTextSide";
import useUpdateSayTextStyle from "../../../../../hooks/Say/patch/useUpdateSayTextStyle";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type UpdateTextSideStyleTypes = {
  plotFieldCommandSayId: string;
  currentTextSide: "left" | "right";
  currentTextStyle: TextStyleTypes;
};

export default function useUpdateTextSideStyle({
  plotFieldCommandSayId,
  currentTextSide,
  currentTextStyle,
}: UpdateTextSideStyleTypes) {
  const updateCommandSaySide = useUpdateSayTextSide({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextSide && plotFieldCommandSayId?.trim().length) {
      updateCommandSaySide.mutate({ textSide: currentTextSide });
    }
  }, [currentTextSide]);

  const updateCommandSayStyle = useUpdateSayTextStyle({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextStyle && plotFieldCommandSayId?.trim().length) {
      updateCommandSayStyle.mutate({ textStyle: currentTextStyle });
    }
  }, [currentTextStyle]);
}
