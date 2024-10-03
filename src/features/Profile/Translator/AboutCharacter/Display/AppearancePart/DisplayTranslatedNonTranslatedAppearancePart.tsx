import { useEffect, useState } from "react";
import useUpdateAppearancePartTranslation from "../../../../../../hooks/Patching/Translation/useUpdateAppearancePartTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../../types/Additional/TranslationTypes";

type DisplayTranslatedNonTranslatedAppearancePartTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  filteredAppearanceType?: TranslationTextFieldNameAppearancePartsTypes;
  translated: TranslationAppearancePartTypes | null;
  nonTranslated: TranslationAppearancePartTypes | null;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  lastIndex: number;
  currentIndex: number;
};

export default function DisplayTranslatedNonTranslatedAppearancePart({
  nonTranslated,
  translated,
  languageToTranslate,
  filteredAppearanceType,
  translateFromLanguage,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedAppearancePartTypes) {
  const [translatedAppearancePart, setTranslatedAppearancePart] = useState("");
  const [translatedBackUpAppearancePart, setTranslatedBackUpAppearancePart] =
    useState("");
  const [backUpAppearancePart, setBackUpAppearancePart] = useState("");
  const [appearancePart, setAppearancePart] = useState("");
  const [appearancePartTypeToRus, setAppearancePartTypeToRus] = useState("");
  const [appearancePartId, setAppearancePartId] = useState("");

  useEffect(() => {
    if (translated) {
      setAppearancePartId(translated.appearancePartId);
      setTranslatedBackUpAppearancePart(translated.translations[0]?.text || "");
      setTranslatedAppearancePart(translated.translations[0]?.text || "");
      const value =
        translated.type === "accessory"
          ? "украшение"
          : translated.type === "art"
          ? "татуировка"
          : translated.type === "body"
          ? "тело"
          : translated.type === "dress"
          ? "костюм"
          : translated.type === "hair"
          ? "волосы"
          : "кожа";
      setAppearancePartTypeToRus(value);
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      setAppearancePart(nonTranslated.translations[0]?.text || "");
      setBackUpAppearancePart(nonTranslated.translations[0]?.text || "");
    } else {
      setAppearancePart("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedTranslatedName = useDebounce({
    value: translatedAppearancePart,
    delay: 500,
  });

  const updateCharacterTranslationTranslated =
    useUpdateAppearancePartTranslation({
      language: translateFromLanguage,
      appearancePartId:
        appearancePartId || nonTranslated?.appearancePartId || "",
      characterId: translated?.characterId || nonTranslated?.characterId || "",
    });

  useEffect(() => {
    if (
      translatedBackUpAppearancePart !== debouncedTranslatedName &&
      debouncedTranslatedName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        appearancePartName: debouncedTranslatedName,
        appearancePartType:
          translated?.type ||
          ("" as TranslationTextFieldNameAppearancePartsTypes),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedName]);

  const debouncedName = useDebounce({
    value: appearancePart,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateAppearancePartTranslation({
    language: languageToTranslate,
    appearancePartId: appearancePartId || nonTranslated?.appearancePartId || "",
    characterId: translated?.characterId || nonTranslated?.characterId || "",
  });

  useEffect(() => {
    if (
      backUpAppearancePart !== debouncedTranslatedName &&
      debouncedName?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        appearancePartName: debouncedName,
        appearancePartType:
          translated?.type ||
          ("" as TranslationTextFieldNameAppearancePartsTypes),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <>
      {filteredAppearanceType ? (
        filteredAppearanceType === translated?.type ||
        ("" as TranslationTextFieldNameAppearancePartsTypes) ? (
          <div
            className={`${
              currentIndex === lastIndex ? "col-span-full" : ""
            } h-fit flex-col w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
          >
            <div
              className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
            >
              <form
                className="flex flex-col gap-[.5rem] p-[1rem] w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={translatedAppearancePart}
                  className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                  onChange={(e) => setTranslatedAppearancePart(e.target.value)}
                />
              </form>
            </div>
            <div
              className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
            >
              <form
                className="flex flex-col gap-[.5rem] p-[1rem] w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={appearancePart}
                  placeholder={appearancePartTypeToRus}
                  className="w-full placeholder:capitalize border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                  onChange={(e) => setAppearancePart(e.target.value)}
                />
              </form>
            </div>
          </div>
        ) : null
      ) : (
        <div
          className={`${
            currentIndex === lastIndex ? "col-span-full" : ""
          } h-fit flex-col w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
        >
          <div
            className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
          >
            <form
              className="flex flex-col gap-[.5rem] p-[1rem] w-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                value={translatedAppearancePart}
                className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                onChange={(e) => setTranslatedAppearancePart(e.target.value)}
              />
            </form>
          </div>
          <div
            className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
          >
            <form
              className="flex flex-col gap-[.5rem] p-[1rem] w-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                value={appearancePart}
                placeholder={appearancePartTypeToRus}
                className="w-full placeholder:capitalize border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                onChange={(e) => setAppearancePart(e.target.value)}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
