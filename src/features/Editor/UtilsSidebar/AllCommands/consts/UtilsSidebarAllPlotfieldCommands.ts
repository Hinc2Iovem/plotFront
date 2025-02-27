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

export type UtilsCommandDescriptionTypes = {
  keyCombinationRus: string;
  keyCombinationEng: string;
  description: string;
};

type CommandTypes = {
  name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
  src: string;
  commandDescription: UtilsCommandDescriptionTypes;
};

export type UtilsSidebarAllPlotfieldCommandsTypes = {
  commandNameFirst: CommandTypes;
  commandNameSecond: CommandTypes;
  rowNumber: "1" | "2" | "3" | "4" | "5" | "6";
};

export const utilsSidebarAllPlotfieldCommands: UtilsSidebarAllPlotfieldCommandsTypes[][] = [
  [
    {
      commandNameFirst: {
        name: "blank",
        src: blank,
        commandDescription: {
          keyCombinationRus: "shift + т",
          keyCombinationEng: "shift + n",
          description: "",
        },
      },
      commandNameSecond: {
        name: "comment",
        src: comment,
        commandDescription: {
          keyCombinationRus: "shift + с + ь",
          keyCombinationEng: "shift + c + m",
          description: "",
        },
      },
      rowNumber: "1",
    },
    {
      commandNameFirst: {
        name: "call",
        src: call,
        commandDescription: {
          keyCombinationRus: "shift + с + д",
          keyCombinationEng: "shift + c + l",
          description: "",
        },
      },
      commandNameSecond: {
        name: "music",
        src: music,
        commandDescription: {
          keyCombinationRus: "shift + ь + г",
          keyCombinationEng: "shift + m + u",
          description: "",
        },
      },
      rowNumber: "1",
    },
  ],
  [
    {
      commandNameFirst: {
        name: "author",
        src: author,
        commandDescription: {
          keyCombinationRus: "shift + ф + г",
          keyCombinationEng: "shift + a + u",
          description: "",
        },
      },
      commandNameSecond: {
        name: "character",
        src: character,
        commandDescription: {
          keyCombinationRus: "shift + с + к",
          keyCombinationEng: "shift + c + r",
          description: "",
        },
      },
      rowNumber: "2",
    },
    {
      commandNameFirst: {
        name: "hint",
        src: hint,
        commandDescription: {
          keyCombinationRus: "shift + р + ш",
          keyCombinationEng: "shift + h + i",
          description: "",
        },
      },
      commandNameSecond: {
        name: "notify",
        src: notify,
        commandDescription: {
          keyCombinationRus: "shift + т + щ",
          keyCombinationEng: "shift + n + o",
          description: "",
        },
      },
      rowNumber: "2",
    },
  ],
  [
    {
      commandNameFirst: {
        name: "achievement",
        src: achievement,
        commandDescription: {
          keyCombinationRus: "shift + ф + с",
          keyCombinationEng: "shift + a + c",
          description: "",
        },
      },
      commandNameSecond: {
        name: "key",
        src: key,
        commandDescription: {
          keyCombinationRus: "shift + л + у",
          keyCombinationEng: "shift + k + e",
          description: "",
        },
      },
      rowNumber: "3",
    },
    {
      commandNameFirst: {
        name: "name",
        src: name,
        commandDescription: {
          keyCombinationRus: "shift + т + ф",
          keyCombinationEng: "shift + n + a",
          description: "",
        },
      },
      commandNameSecond: {
        name: "getitem",
        src: getitem,
        commandDescription: {
          keyCombinationRus: "shift + п + у",
          keyCombinationEng: "shift + g + e",
          description: "",
        },
      },
      rowNumber: "3",
    },
  ],
  [
    {
      commandNameFirst: {
        name: "effect",
        src: effect,
        commandDescription: {
          keyCombinationRus: "shift + у + а",
          keyCombinationEng: "shift + e + f",
          description: "",
        },
      },
      commandNameSecond: {
        name: "cutscene",
        src: cutscene,
        commandDescription: {
          keyCombinationRus: "shift + с + г",
          keyCombinationEng: "shift + c + u",
          description: "",
        },
      },
      rowNumber: "4",
    },
    {
      commandNameFirst: {
        name: "ambient",
        src: ambient,
        commandDescription: {
          keyCombinationRus: "shift + ф + ь",
          keyCombinationEng: "shift + a + m",
          description: "",
        },
      },
      commandNameSecond: {
        name: "sound",
        src: sound,
        commandDescription: {
          keyCombinationRus: "shift + ы + щ",
          keyCombinationEng: "shift + s + o",
          description: "",
        },
      },
      rowNumber: "4",
    },
  ],
  [
    {
      commandNameFirst: {
        name: "background",
        src: background,
        commandDescription: {
          keyCombinationRus: "shift + и + ф",
          keyCombinationEng: "shift + b + a",
          description: "",
        },
      },
      commandNameSecond: {
        name: "move",
        src: move,
        commandDescription: {
          keyCombinationRus: "shift + ь + щ",
          keyCombinationEng: "shift + m + o",
          description: "",
        },
      },
      rowNumber: "5",
    },
    {
      commandNameFirst: {
        name: "wardrobe",
        src: wardrobe,
        commandDescription: {
          keyCombinationRus: "shift + ц + ф",
          keyCombinationEng: "shift + w + a",
          description: "",
        },
      },
      commandNameSecond: {
        name: "suit",
        src: suit,
        commandDescription: {
          keyCombinationRus: "shift + ы + г",
          keyCombinationEng: "shift + s + u",
          description: "",
        },
      },
      rowNumber: "5",
    },
  ],
  [
    {
      commandNameFirst: {
        name: "choice",
        src: choice,
        commandDescription: {
          keyCombinationRus: "shift + с + р",
          keyCombinationEng: "shift + c + h",
          description: "",
        },
      },
      commandNameSecond: {
        name: "if",
        src: commandif,
        commandDescription: {
          keyCombinationRus: "shift + ш + а",
          keyCombinationEng: "shift + s + o",
          description: "",
        },
      },
      rowNumber: "6",
    },
    {
      commandNameFirst: {
        name: "condition",
        src: condition,
        commandDescription: {
          keyCombinationRus: "shift + с + щ",
          keyCombinationEng: "shift + c + o",
          description: "",
        },
      },
      commandNameSecond: {
        name: "wait",
        src: wait,
        commandDescription: {
          keyCombinationRus: "shift + ц + ф",
          keyCombinationEng: "shift + w + a",
          description: "",
        },
      },
      rowNumber: "6",
    },
  ],
];
