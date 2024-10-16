import amethyst from "../../../../../../assets/images/Editor/amethyst.png";
import common from "../../../../../../assets/images/Editor/blank.png";
import relationship from "../../../../../../assets/images/Editor/relationship.png";
import characteristic from "../../../../../../assets/images/Story/characteristic.png";

type MovingOptionBlocksTypes = {
  ov: string;
  i: number;
  moveBlocks: boolean;
};

export default function MovingOptionBlocks({
  i,
  ov,
  moveBlocks,
}: MovingOptionBlocksTypes) {
  return (
    <button
      style={{
        transform: moveBlocks ? `translateX(-${1 + i}rem)` : ``,
      }}
      className={`w-[3rem] h-full max-w-[3.5rem] bg-secondary flex-grow rounded-md ${
        moveBlocks ? "shadow-md" : ""
      } transition-all absolute`}
    >
      <img
        src={
          ov === "characteristic"
            ? characteristic
            : ov === "common"
            ? common
            : ov === "premium"
            ? amethyst
            : relationship
        }
        alt={ov}
      />
    </button>
  );
}
