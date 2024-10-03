type BackgroundPointOfMovementTypes = {
  setMoveValue: React.Dispatch<React.SetStateAction<string>>;
  setShowNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  moveValue: string;
  showNotificationModal: boolean;
};

export default function BackgroundPointOfMovement({
  moveValue,
  setMoveValue,
  setShowNotificationModal,
  showNotificationModal,
}: BackgroundPointOfMovementTypes) {
  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <input
          value={moveValue || ""}
          type="text"
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Движение по локации"
          onChange={(e) => setMoveValue(e.target.value)}
        />
      </form>
      <aside
        onClick={() => setShowNotificationModal(false)}
        className={`${
          showNotificationModal ? "" : "hidden"
        } absolute translate-y-[170%] right-0 bg-white shadow-md rounded-md border-red-400 border-[2px] border-dashed w-[70%] text-[1.4rem] p-[.5rem] text-right text-red-300`}
      >
        Значение должно быть десятичным числом в промежутке от 0.0 до 1.0
      </aside>
    </>
  );
}
