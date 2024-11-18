type ConditionBlockFieldNameTypes = {
  currentlyActive: boolean;
  text: string;
};

export default function ConditionBlockFieldName({ currentlyActive, text }: ConditionBlockFieldNameTypes) {
  return (
    <div
      className={`${
        currentlyActive ? "" : "hidden"
      } absolute top-0 right-[.5rem] bg-secondary p-[.5rem] shadow-sm shadow-dark-mid-gray -translate-y-1/2`}
    >
      <span className="text-[1.3rem] text-text-light">{text}</span>
    </div>
  );
}
