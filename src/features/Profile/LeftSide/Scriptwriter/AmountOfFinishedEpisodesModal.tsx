export default function AmountOfFinishedEpisodesModal({
  amountOfFinishedEpisodes,
}: {
  amountOfFinishedEpisodes: number;
}) {
  return (
    <div className={`w-full p-[1rem] bg-secondary rounded-md shadow-sm`}>
      <h3 className="text-[1.5rem] text-center text-text-light">
        Количество законченных эпизодов: {amountOfFinishedEpisodes ?? 0}
      </h3>
    </div>
  );
}
