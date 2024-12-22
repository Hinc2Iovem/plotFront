import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import PlotfieldTextarea from "../../../../../../ui/Textareas/PlotfieldTextarea";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandComment from "../../../hooks/Comment/useGetCommandComment";
import useUpdateCommentText from "../../../hooks/Comment/useUpdateCommentText";

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

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

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
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="min-w-[10rem] flex-grow relative"
      >
        <PlotfieldTextarea
          onBlur={onBlur}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Коммент"
        />
      </form>
    </div>
  );
}
