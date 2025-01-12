import useFindoutWidthOfContainer from "@/hooks/UI/useFindoutWidthOfContainer";
import { AppearancePartValueTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import GoBackButton from "@/ui/Buttons/StoryPage/GoBackButton";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllAppearancePartsByCharacterIdAndType from "../../hooks/Fetching/AppearancePart/useGetAllAppearanceParts";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { CharacterValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import WardrobeItem from "./WardrobeItem";
import AppearanceFilters from "./AppearanceFilters";
import NewAppearanceForm from "./Form/NewAppearanceForm";

export default function Wardrobe() {
  const { storyId } = useParams();
  const [created, setCreated] = useState<boolean | null>(null);
  const defaultObj: AppearancePartValueTypes = {
    appearanceId: "",
    appearanceName: "",
    appearanceType: "" as TranslationTextFieldNameAppearancePartsTypes,
    appearanceImg: "",
  };
  const [characterId, setCharacterId] = useState("");
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });

  const [appearanceValue, setAppearanceValue] = useState<AppearancePartValueTypes>(defaultObj);
  const [initAppearanceValue, setInitAppearanceValue] = useState<AppearancePartValueTypes>(defaultObj);

  const [appearanceSearch, setAppearanceSearch] = useState("");
  const [currentAppearanceType, setCurrentAppearanceType] = useState(
    "" as TranslationTextFieldNameAppearancePartsTypes | "temp"
  );

  const { data: appearanceParts } = useGetAllAppearancePartsByCharacterIdAndType({
    characterId: characterValue._id || "",
    appearanceType: currentAppearanceType,
    language: "russian",
  });

  const filteredAppearanceParts = useMemo(() => {
    if (appearanceParts) {
      let arr = [...appearanceParts];
      if (appearanceSearch.trim().length || currentAppearanceType.trim().length) {
        if (appearanceSearch.trim().length) {
          arr = arr.filter((e) =>
            e.translations[0].text?.trim()?.toLowerCase().includes(appearanceSearch.trim().toLowerCase())
          );
        }
        if (currentAppearanceType.trim().length) {
          arr = arr.filter((e) => e.type === currentAppearanceType);
        }
        return arr;
      } else {
        return appearanceParts;
      }
    } else {
      return [];
    }
  }, [appearanceParts, currentAppearanceType, appearanceSearch]);

  const { ref, width } = useFindoutWidthOfContainer();

  return (
    <>
      <GoBackButton className="text-[25px]" link={`/stories/${storyId}`} />
      <section className="max-w-[1480px] mx-auto relative">
        <main className="my-[10px] flex md:flex-row flex-col-reverse gap-[5px] px-[5px]">
          <div
            ref={ref}
            className="w-full flex-grow h-screen border-border border-[1px] rounded-md relative overflow-y-auto | containerScroll"
          >
            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[5px] justify-items-center p-[5px] rounded-md">
              {filteredAppearanceParts &&
                filteredAppearanceParts?.map((cd) => (
                  <WardrobeItem
                    key={cd._id}
                    created={created}
                    setCharacterId={setCharacterId}
                    setInitAppearanceValue={setInitAppearanceValue}
                    setAppearanceValue={setAppearanceValue}
                    appearanceValue={appearanceValue}
                    {...cd}
                  />
                ))}
            </div>
            <div className="xl:h-[50px] h-[150px] w-full"></div>
          </div>
          <AppearanceFilters
            width={width}
            characterValue={characterValue}
            setCharacterValue={setCharacterValue}
            setCurrentAppearanceType={setCurrentAppearanceType}
            appearanceSearch={appearanceSearch}
            setAppearanceSearch={setAppearanceSearch}
            appearanceSearchType={currentAppearanceType}
          />
          <NewAppearanceForm
            filteredAppearanceType={currentAppearanceType}
            setInitAppearanceValue={setInitAppearanceValue}
            appearanceValue={appearanceValue}
            characterId={characterId}
            initAppearanceValue={initAppearanceValue}
            setAppearanceValue={setAppearanceValue}
            setCreated={setCreated}
          />
        </main>
      </section>
    </>
  );
}
