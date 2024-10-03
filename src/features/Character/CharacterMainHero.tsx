import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import wardrobe from "../../assets/images/Story/wardrobe.png";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import PreviewImage from "../shared/utilities/PreviewImage";
import "./characterStyle.css";

type CharacterItemMainHeroTypes = {
  isFrontSide: boolean;
  characterName: string;
  img?: string;
  characterId: string;
};

export default function CharacterItemMainHero({
  isFrontSide,
  characterId,
  characterName,
  img,
}: CharacterItemMainHeroTypes) {
  const { storyId } = useParams();
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(
    img ? img : null
  );

  const uploadImgMutation = useUpdateImg({
    id: characterId,
    path: "/characters",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isFrontSide ? (
        <>
          {img ? (
            <div className="w-full h-full rounded-t-md relative shadow-sm">
              <img
                src={img}
                alt="StoryBackground"
                className="object-cover w-full h-full cursor-pointer rounded-t-md border-[3px] border-b-0 border-white"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-alabaster">
              <PreviewImage
                imgClasses="w-full h-full bg-neutral-alabaster object-cover rounded-md border-[2px] border-b-0 rounded-b-none border-white"
                divClasses="bg-neutral-alabaster relative top-1/2"
                imagePreview={imagePreview}
                setPreview={setPreview}
              />
            </div>
          )}
          <div className="w-full rounded-b-md bg-neutral-alabaster p-[1rem] text-[1.5rem] shadow-sm border-t-[1px] border-gray-300 rounded-t-md shadow-gray-600">
            {characterName.length > 30
              ? characterName.substring(0, 30) + "..."
              : characterName}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-[1rem] p-[1rem] justify-between h-full">
          <div className="gap-[1rem] flex flex-col">
            <div>
              <h3 className="text-[2rem] break-words">{characterName}</h3>
              <p className="text-[1.3rem] break-words">НеймТаг: {"SMH"}</p>
            </div>
          </div>

          <div className="flex gap-[1rem] flex-wrap">
            <Link
              className="ml-auto"
              to={`/stories/${storyId}/wardrobes/characters/${characterId}`}
            >
              <button className=" bg-white shadow-md p-[.5rem] rounded-md active:scale-[0.99] hover:scale-[1.01] ">
                <img src={wardrobe} alt="Wardrobe" className="w-[3rem]" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
