export default function AmountOfFinishedEpisodesModal({
  amountOfFinishedEpisodes,
}: {
  amountOfFinishedEpisodes: number;
}) {
  return (
    <div className={`w-full p-[10px] rounded-md border-[1px] border-border`}>
      <h3 className="text-[15px] text-center text-text">
        Количество законченных эпизодов: {amountOfFinishedEpisodes ?? 0}
      </h3>
    </div>
  );
}
