import { SyncLoader } from "react-spinners";
import done from "../../../assets/images/shared/verified.png";

type SyncLoadTypes = {
  conditionToStart: boolean;
  conditionToLoading: boolean;
  className: string;
};

export default function SyncLoad({
  conditionToStart,
  conditionToLoading,
  className,
}: SyncLoadTypes) {
  return (
    <div
      className={`absolute ${
        conditionToStart ? " rounded-full" : "hidden"
      } ${className} `}
    >
      {conditionToLoading ? (
        <SyncLoader size={7} aria-label="Loading Spinner" color="lightblue" />
      ) : (
        <img className="w-[3rem]" src={done} alt="OK" />
      )}
    </div>
  );
}
