import { ChoiceOptionVariationsRusTypes } from "@/types/StoryEditor/PlotField/Choice/ChoiceTypes";
import common from "@/assets/images/Editor/blank.png";
import premium from "@/assets/images/Editor/amethyst.png";
import relationship from "@/assets/images/Editor/relationship.png";
import characteristic from "@/assets/images/Story/characteristic.png";

export type ChoiceOptionVariationsWithIconsTypes = {
  icon: string;
  variation: ChoiceOptionVariationsRusTypes;
};

export const ChoiceOptionVariationsWithIcons: ChoiceOptionVariationsWithIconsTypes[] = [
  {
    icon: common,
    variation: "обычный",
  },
  {
    icon: premium,
    variation: "премиум",
  },
  {
    icon: relationship,
    variation: "отношения",
  },
  {
    icon: characteristic,
    variation: "характеристика",
  },
];
