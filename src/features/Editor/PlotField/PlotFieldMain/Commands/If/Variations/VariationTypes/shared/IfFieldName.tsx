type IfFieldNameTypes = {
  currentlyActive: boolean;
  text: string;
};

export default function IfFieldName({ currentlyActive, text }: IfFieldNameTypes) {
  return (
    <div
      className={`${
        currentlyActive ? "" : "hidden"
      } absolute top-0 right-[5px] border-border border-[2px] rounded-md bg-secondary p-[5px] shadow-sm shadow-dark-mid-gray -translate-y-1/2`}
    >
      <span className="text-[14px] text-text">{text}</span>
    </div>
  );
}
