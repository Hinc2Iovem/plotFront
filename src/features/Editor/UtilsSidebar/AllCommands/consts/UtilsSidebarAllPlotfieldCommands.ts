import { AllPossiblePlotFieldComamndsSaySubVariationsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import blank from "@/assets/images/Editor/command.png";
import comment from "@/assets/images/Editor/Commands/comment.png";
import call from "@/assets/images/Editor/Commands/call.png";
import music from "@/assets/images/Editor/Commands/music.png";
import author from "@/assets/images/Editor/Commands/author.png";
import character from "@/assets/images/Story/characters.png";
import hint from "@/assets/images/Editor/Commands/hint.png";
import notify from "@/assets/images/Editor/Commands/notify.png";
import achievement from "@/assets/images/Editor/Commands/achievement.png";
import key from "@/assets/images/Editor/Commands/key.png";
import name from "@/assets/images/Editor/Commands/name.png";
import getitem from "@/assets/images/Editor/Commands/getitem.png";
import effect from "@/assets/images/Editor/Commands/effect.png";
import cutscene from "@/assets/images/Editor/Commands/cutscene.png";
import ambient from "@/assets/images/Editor/Commands/ambient.png";
import sound from "@/assets/images/Editor/Commands/sound.png";
import background from "@/assets/images/Editor/Commands/background.png";
import move from "@/assets/images/Editor/Commands/move.png";
import wardrobe from "@/assets/images/Editor/Commands/wardrobe.png";
import suit from "@/assets/images/Editor/Commands/suit.png";
import choice from "@/assets/images/Editor/Commands/choice.png";
import commandif from "@/assets/images/Editor/Commands/if.png";
import condition from "@/assets/images/Editor/Commands/condition.png";
import wait from "@/assets/images/Editor/Commands/wait.png";

export type UtilsSidebarAllPlotfieldCommandsTypes = {
  commandNameFirst: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
  commandNameSecond: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
};

export const utilsSidebarAllPlotfieldCommands: UtilsSidebarAllPlotfieldCommandsTypes[][] = [
  [
    {
      commandNameFirst: { name: "blank", src: blank },
      commandNameSecond: {
        name: "comment",
        src: comment,
      },
    },
    {
      commandNameFirst: {
        name: "call",
        src: call,
      },
      commandNameSecond: {
        name: "music",
        src: music,
      },
    },
  ],
  [
    {
      commandNameFirst: {
        name: "author",
        src: author,
      },
      commandNameSecond: {
        name: "character",
        src: character,
      },
    },
    {
      commandNameFirst: {
        name: "hint",
        src: hint,
      },
      commandNameSecond: {
        name: "notify",
        src: notify,
      },
    },
  ],
  [
    {
      commandNameFirst: {
        name: "achievement",
        src: achievement,
      },
      commandNameSecond: {
        name: "key",
        src: key,
      },
    },
    {
      commandNameFirst: {
        name: "name",
        src: name,
      },
      commandNameSecond: {
        name: "getitem",
        src: getitem,
      },
    },
  ],
  [
    {
      commandNameFirst: {
        name: "effect",
        src: effect,
      },
      commandNameSecond: {
        name: "cutscene",
        src: cutscene,
      },
    },
    {
      commandNameFirst: {
        name: "ambient",
        src: ambient,
      },
      commandNameSecond: {
        name: "sound",
        src: sound,
      },
    },
  ],
  [
    {
      commandNameFirst: {
        name: "background",
        src: background,
      },
      commandNameSecond: {
        name: "move",
        src: move,
      },
    },
    {
      commandNameFirst: {
        name: "wardrobe",
        src: wardrobe,
      },
      commandNameSecond: {
        name: "suit",
        src: suit,
      },
    },
  ],
  [
    {
      commandNameFirst: {
        name: "choice",
        src: choice,
      },
      commandNameSecond: {
        name: "if",
        src: commandif,
      },
    },
    {
      commandNameFirst: {
        name: "condition",
        src: condition,
      },
      commandNameSecond: {
        name: "wait",
        src: wait,
      },
    },
  ],
];
