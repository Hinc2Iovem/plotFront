import TopologyBlocksPrompt, {
  TopologyBlockValueTypes,
} from "@/features/Editor/components/shared/TopologyBlocksPrompt";
import { useEffect, useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import useGetTopologyBlockById from "../../../../hooks/TopologyBlock/useGetTopologyBlockById";

type ChoiceMultipleBlockTypes = {
  choiceId: string;
  exitBlockId: string;
  choiceVariationTypes: ChoiceVariationsTypes;
  setExitBlockId: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChoiceMultipleBlock({
  choiceId,
  exitBlockId,
  choiceVariationTypes,
  setExitBlockId,
}: ChoiceMultipleBlockTypes) {
  const [update, setUpdate] = useState<boolean>(false);

  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: exitBlockId,
  });
  const [topologyBlock, setTopologyBlock] = useState<TopologyBlockValueTypes>({
    id: exitBlockId,
    name: "",
  });
  const [initTopologyBlock, setInitTopologyBlock] = useState<TopologyBlockValueTypes>({
    id: exitBlockId,
    name: "",
  });

  useEffect(() => {
    if (currentTopologyBlock) {
      setTopologyBlock((prev) => ({
        ...prev,
        name: currentTopologyBlock.name || "",
      }));
      setInitTopologyBlock((prev) => ({
        ...prev,
        name: currentTopologyBlock.name || "",
      }));
    }
  }, [currentTopologyBlock]);

  const updateChoice = useUpdateChoice({ choiceId });

  useEffect(() => {
    if (update) {
      setExitBlockId(topologyBlock.id);
      updateChoice.mutate({
        choiceType: choiceVariationTypes || "multiple",
        exitBlockId: topologyBlock.id,
      });

      setInitTopologyBlock(topologyBlock);
      setUpdate(false);
    }
  }, [update]);

  return (
    <div className={`${choiceVariationTypes === "multiple" ? "" : "hidden"}`}>
      <TopologyBlocksPrompt
        setUpdate={setUpdate}
        initValue={initTopologyBlock}
        setTopologyBlockValue={setTopologyBlock}
        topologyBlockName={topologyBlock?.name || ""}
      />
    </div>
  );
}
