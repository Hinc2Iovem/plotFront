import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldTextarea from "../../../../../../ui/Textareas/PlotfieldTextarea";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandComment from "../../../hooks/Comment/useGetCommandComment";
import useUpdateCommentText from "../../../hooks/Comment/useUpdateCommentText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import DeleteCommandContextMenuWrapper from "../../components/DeleteCommandContextMenuWrapper";

type CommandCommentFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandCommentField({ plotFieldCommandId, topologyBlockId }: CommandCommentFieldTypes) {
  const { episodeId } = useParams();

  const { data: commandComment } = useGetCommandComment({
    plotFieldCommandId,
  });

  const [commandCommentId, setCommandCommentId] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (commandComment) {
      setCommandCommentId(commandComment._id);
      setComment(commandComment?.comment || "");
    }
  }, [commandComment]);

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const updateCommentText = useUpdateCommentText({
    commentId: commandCommentId,
    comment,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "comment",
    id: plotFieldCommandId,
    text: comment,
    topologyBlockId,
    type: "command",
  });

  const onBlur = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "comment",
        id: plotFieldCommandId,
        type: "command",
        value: comment,
      });
    }
    updateCommentText.mutate();
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <DeleteCommandContextMenuWrapper plotfieldCommandId={plotFieldCommandId} topologyBlockId={topologyBlockId}>
        <div className="sm:w-[20%] min-w-[100px] w-full relative">
          <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
            comment
          </PlotfieldCommandNameField>
        </div>
      </DeleteCommandContextMenuWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="min-w-[100px] flex-grow"
      >
        <PlotfieldTextarea
          onBlur={onBlur}
          value={comment}
          className="min-h-[70px]"
          onChange={(e) => setComment(e.target.value)}
          placeholder="Коммент"
        />
      </form>
    </div>
  );
}
