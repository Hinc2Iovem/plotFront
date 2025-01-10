import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandName from "../../../hooks/Name/useGetCommandName";
import useUpdateNameText from "../../../hooks/Name/useUpdateNameText";
import PlotfieldUnknownCharacterPromptMain from "../Prompts/Characters/PlotfieldUnknownCharacterPromptMain";
import usePrepareCharacterValuesForNameCommand from "./hooks/usePrepareCharacterValuesForNameCommand";

type CommandNameFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandNameField({ plotFieldCommandId, command, topologyBlockId }: CommandNameFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Name");

  const [initCharacterId, setInitCharacterId] = useState("");

  const { data: commandName } = useGetCommandName({
    plotFieldCommandId,
  });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const [commandNameId, setCommandNameId] = useState("");

  const { characterValue, setCharacterValue } = usePrepareCharacterValuesForNameCommand({
    characterId: commandName?.characterId || "",
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "name",
    id: plotFieldCommandId,
    text: `${characterValue.characterUnknownName} ${characterValue.characterName}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandName) {
      setCommandNameId(commandName._id);
      setCharacterValue((prev) => ({
        ...prev,
        characterId: commandName.characterId,
      }));
      setInitCharacterId(commandName.characterId);
    }
  }, [commandName]);

  const updateNameText = useUpdateNameText({
    nameId: commandNameId,
    plotFieldCommandId,
  });

  useEffect(() => {
    if (initCharacterId !== characterValue.characterId && characterValue.characterId?.trim().length) {
      updateNameText.mutate({
        characterId: characterValue.characterId,
      });
      setInitCharacterId(characterValue.characterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterValue]);

  const onBlurUpdateSearchValue = (unknownName: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "name",
        id: plotFieldCommandId,
        type: "command",
        value: `${unknownName} ${characterValue.characterName}`,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <div className="flex gap-[5px] sm:flex-row flex-col flex-grow">
        <PlotfieldUnknownCharacterPromptMain
          setCharacterValue={setCharacterValue}
          characterValue={characterValue}
          onChange={(value) => onBlurUpdateSearchValue(value)}
        />
        <div className="flex-grow min-w-[150px] min-h-[36.5px] bg-secondary items-center flex gap-[.5rem] border-border rounded-md border-[1px] relative">
          <p className="text-[17px] text-text rounded-md px-[10px] pr-[5px]">
            {characterValue.characterName.trim().length ? characterValue.characterName : "Настоящее имя"}
          </p>
          <img
            src={characterValue.characterImg}
            alt="CharacterImg"
            className={`${
              characterValue.characterImg?.trim().length ? "" : "hidden"
            } w-[30px] object-cover rounded-md absolute right-0`}
          />
        </div>
      </div>
    </div>
  );
}
