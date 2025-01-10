import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldTextarea from "../../../../../../ui/Textareas/PlotfieldTextarea";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandComment from "../../../hooks/Comment/useGetCommandComment";
import useUpdateCommentText from "../../../hooks/Comment/useUpdateCommentText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandCommentFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandCommentField({
  plotFieldCommandId,
  topologyBlockId,
  command,
}: CommandCommentFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Comment");

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
    commandName: nameValue || "comment",
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
      <div className="sm:w-[20%] min-w-[100px] w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>

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
