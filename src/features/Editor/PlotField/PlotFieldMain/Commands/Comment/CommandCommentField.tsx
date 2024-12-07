import { useEffect, useState } from "react";
import useGetCommandComment from "../../../hooks/Comment/useGetCommandComment";
import useUpdateCommentText from "../../../hooks/Comment/useUpdateCommentText";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldTextarea from "../../../../../shared/Textareas/PlotfieldTextarea";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useSearch from "../../Search/SearchContext";
import { useParams } from "react-router-dom";

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

  const debouncedValue = useDebounce({ value: command, delay: 700 });

  const updateCommentText = useUpdateCommentText({
    commentId: commandCommentId,
    comment: debouncedValue,
  });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "comment",
          id: plotFieldCommandId,
          text: debouncedValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (commandComment?.comment !== debouncedValue && debouncedValue?.trim().length && commandCommentId) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "comment",
          id: plotFieldCommandId,
          type: "command",
          value: debouncedValue,
        });
      }
      updateCommentText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
        <PlotfieldTextarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коммент" />
      </form>
    </div>
  );
}
