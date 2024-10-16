import { useEffect, useState } from "react";
import useGetCommandComment from "../hooks/Comment/useGetCommandComment";
import useUpdateCommentText from "../hooks/Comment/useUpdateCommentText";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";

type CommandCommentFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandCommentField({
  plotFieldCommandId,
  command,
}: CommandCommentFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Comment");

  const { data: commandComment } = useGetCommandComment({
    plotFieldCommandId,
  });
  const theme = localStorage.getItem("theme");

  const [commandCommentId, setCommandCommentId] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (commandComment) {
      setCommandCommentId(commandComment._id);
      setComment(commandComment?.comment || "");
    }
  }, [commandComment]);

  const debouncedValue = useDebounce({ value: command, delay: 700 });

  const updateCommentText = useUpdateCommentText({
    commentId: commandCommentId,
    comment: debouncedValue,
  });

  useEffect(() => {
    if (
      commandComment?.comment !== debouncedValue &&
      debouncedValue?.trim().length
    ) {
      updateCommentText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] w-full relative">
        <h3 className="text-[1.3rem] text-start text-text-light outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary cursor-default">
          {nameValue}
        </h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="min-w-[10rem] flex-grow relative"
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Коммент"
          className={`text-[1.4rem] max-h-[10rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light w-full px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary`}
        />
      </form>
    </div>
  );
}
