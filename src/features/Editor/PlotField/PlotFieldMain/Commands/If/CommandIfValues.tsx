import useGetAllIfValuesByCommandIfId from "../hooks/If/Values/useGetIfValueByCommandIfId";
import CommandIfValueItem from "./CommandIfValueItem";

type CommandIfValuesTypes = {
  ifId: string;
};

export default function CommandIfValues({ ifId }: CommandIfValuesTypes) {
  const { data: values } = useGetAllIfValuesByCommandIfId({ ifId });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-grow flex-wrap w-full gap-[1rem]"
    >
      {values?.map((v) => (
        <CommandIfValueItem key={v._id} {...v} />
      ))}
    </form>
  );
}
