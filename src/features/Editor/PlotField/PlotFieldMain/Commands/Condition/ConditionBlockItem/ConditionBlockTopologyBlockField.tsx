import TopologyBlocksPrompt, {
  TopologyBlockValueTypes,
} from "@/features/Editor/components/shared/TopologyBlocksPrompt";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUpdateConditionBlockTopologyBlockId from "../../../../hooks/Condition/ConditionBlock/useUpdateConditionBlockTopologyBlockId";
import useGetTopologyBlockById from "../../../../hooks/TopologyBlock/useGetTopologyBlockById";
import useConditionBlocks from "../Context/ConditionContext";

type ConditionBlockTopologyBlockFieldTpyes = {
  targetBlockId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  topologyBlockName: string;
  isElse: boolean;
};

export default function ConditionBlockTopologyBlockField({
  conditionBlockId,
  plotfieldCommandId,
  targetBlockId,
  topologyBlockName,
  isElse,
}: ConditionBlockTopologyBlockFieldTpyes) {
  const { episodeId } = useParams();
  const [update, setUpdate] = useState(false);
  const { updateConditionBlockTargetBlockId } = useConditionBlocks();
  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });

  const defaultObj: TopologyBlockValueTypes = {
    id: targetBlockId,
    name: topologyBlockName,
  };

  const [topologyBlockValue, setTopologyBlockValue] = useState<TopologyBlockValueTypes>(defaultObj);
  const [initValue, setInitValue] = useState<TopologyBlockValueTypes>(defaultObj);

  useEffect(() => {
    if (topologyBlock) {
      updateConditionBlockTargetBlockId({
        conditionBlockId,
        plotfieldCommandId,
        targetBlockId,
        topologyBlockName: topologyBlock?.name || "",
      });

      setTopologyBlockValue({
        id: topologyBlock._id,
        name: topologyBlock?.name || "",
      });
      setInitValue({
        id: topologyBlock._id,
        name: topologyBlock?.name || "",
      });
    }
  }, [topologyBlock]);

  const updateTopologyBlock = useUpdateConditionBlockTopologyBlockId({
    conditionBlockId: conditionBlockId,
    sourceBlockId: targetBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    if (topologyBlockValue && topologyBlockValue.name !== initValue.name && update) {
      setInitValue({
        name: topologyBlockValue.name,
        id: topologyBlockValue.id,
      });

      updateConditionBlockTargetBlockId({
        conditionBlockId,
        plotfieldCommandId,
        targetBlockId,
        topologyBlockName: topologyBlock?.name || "",
      });

      updateTopologyBlock.mutate({ targetBlockId: topologyBlockValue.id });

      setUpdate(false);
    }
  }, [topologyBlockValue]);

  return (
    <div
      className={`${
        isElse ? "relative self-end flex-grow" : "relative w-full flex justify-between flex-wrap gap-[10px]"
      }`}
    >
      <TopologyBlocksPrompt
        initValue={initValue}
        setUpdate={setUpdate}
        inputClasses={`${
          isElse ? "border-none" : "border-border border-[1px]"
        } focus:text-start text-center text-[20px] shadow-md hover:shadow-accent hover:shadow-sm transition-all`}
        currentlyFocusedBlockId={topologyBlockValue.id}
        setTopologyBlockValue={setTopologyBlockValue}
        topologyBlockName={topologyBlockValue.name}
      />
    </div>
  );
}
