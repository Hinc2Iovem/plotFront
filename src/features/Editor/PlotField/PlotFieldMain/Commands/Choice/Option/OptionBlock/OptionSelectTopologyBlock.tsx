import TopologyBlocksPrompt, {
  TopologyBlockValueTypes,
} from "@/features/Editor/components/shared/TopologyBlocksPrompt";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUpdateChoiceOptionTopologyBlock from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTopologyBlock";
import useGetTopologyBlockById from "../../../../../hooks/TopologyBlock/useGetTopologyBlockById";
import useChoiceOptions from "../../Context/ChoiceContext";

type OptionSelecteTopologyBlockTypes = {
  topologyBlockId: string;
  choiceOptionId: string;
  choiceId: string;
  topologyBlockName: string;
};

export default function OptionSelectTopologyBlock({
  topologyBlockId,
  choiceOptionId,
  choiceId,
  topologyBlockName,
}: OptionSelecteTopologyBlockTypes) {
  // TODO zalupa
  const { episodeId } = useParams();
  const updateChoiceOptionTopologyBlockId = useChoiceOptions((state) => state.updateChoiceOptionTopologyBlockId);

  const [update, setUpdate] = useState(false);
  const [topologyBlockValue, setTopologyBlockValue] = useState<TopologyBlockValueTypes>({
    id: topologyBlockId,
    name: topologyBlockName,
  });
  const [initTopologyBlock, setInitTopologyBlock] = useState<TopologyBlockValueTypes>({
    id: topologyBlockId,
    name: topologyBlockName,
  });

  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId,
  });

  useEffect(() => {
    if (topologyBlock) {
      setTopologyBlockValue((prev) => ({
        ...prev,
        name: topologyBlock?.name || "",
      }));
      setInitTopologyBlock((prev) => ({
        ...prev,
        name: topologyBlock?.name || "",
      }));
    }
  }, [topologyBlock]);

  const updateOptionTopologyBlock = useUpdateChoiceOptionTopologyBlock({
    choiceOptionId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    if (update) {
      updateChoiceOptionTopologyBlockId({
        choiceId,
        choiceOptionId,
        topologyBlockId: topologyBlockValue.id,
        topologyBlockName: topologyBlockValue?.name || "",
      });

      setInitTopologyBlock(topologyBlockValue);

      updateOptionTopologyBlock.mutate({
        targetBlockId: topologyBlockValue.id,
        sourceBlockId: topologyBlockId,
      });
      setUpdate(false);
    }
  }, [update]);

  return (
    <TopologyBlocksPrompt
      initValue={initTopologyBlock}
      setTopologyBlockValue={setTopologyBlockValue}
      setUpdate={setUpdate}
      topologyBlockName={topologyBlockValue.name}
    />
  );
}
