import useGetAllWardrobeAppearancePartBlocks from "@/features/Editor/PlotField/hooks/Wardrobe/WardrobeAppearancePartBlock/useGetAllWardrobeAppearancePartBlocks";
import WardrobeAppearancePartBlock from "./WardrobeAppearancePartBlock";
import WardrobeCharacterAppearancePartForm from "./WardrobeCharacterAppearancePartForm";

type WardrobeAppearanceTypes = {
  commandWardrobeId: string;
  characterId: string;
  setAllAppearanceNames: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function WardrobeAppearance({
  characterId,
  commandWardrobeId,
  setAllAppearanceNames,
}: WardrobeAppearanceTypes) {
  const { data: allAppearancePartBlocks } = useGetAllWardrobeAppearancePartBlocks({ commandWardrobeId });

  return (
    <>
      <WardrobeCharacterAppearancePartForm commandWardrobeId={commandWardrobeId} characterId={characterId} />

      <div className={`flex flex-col w-full bg-primary-darker rounded-md max-h-[220px]`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[5px] w-full overflow-y-auto px-[5px] | containerScroll">
          {allAppearancePartBlocks?.map((a) => (
            <WardrobeAppearancePartBlock key={a._id} {...a} setAllAppearanceNames={setAllAppearanceNames} />
          ))}
        </div>
      </div>
    </>
  );
}
