import { toastErrorStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { KeyTypes } from "@/types/StoryEditor/PlotField/Key/KeyTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useGetAllKeysByStoryId from "../../../../../../hooks/Key/useGetAllKeysByStoryId";

export type DebouncedCheckKeyTypes = {
  keyId: string;
  keyName: string;
};

type KeyPromptsModalTypes = {
  setCurrentKeyName: React.Dispatch<React.SetStateAction<string>>;
  currentKeyName: string;
  initValue: string;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentlyActive?: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

const KeyPromptsModal = ({
  setCurrentKeyName,
  currentKeyName,
  setCommandKeyId,
  initValue,
  onChange,
  setCurrentlyActive,
  onBlur,
}: KeyPromptsModalTypes) => {
  const { storyId } = useParams();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });

  const memoizedKeys = useMemo(() => {
    if (!keys) return [];

    if (currentKeyName) {
      return keys?.filter((k) => k?.text?.toLowerCase().includes(currentKeyName?.toLowerCase()));
    }
    return keys;
  }, [currentKeyName, keys]);

  // const createKey = useCreateNewKeyAsValue({ storyId: storyId || "" });

  const keyExists = ({ value }: { value?: string }) => {
    const currentValue = value?.trim().length ? value : currentKeyName;

    if (!currentValue.trim().length) {
      return;
    }

    if (currentValue.trim() === initValue.trim()) {
      return;
    }

    const existingKey = memoizedKeys?.find((k) => k.text?.toLowerCase() === currentValue?.toLowerCase());

    if (setCurrentlyActive) {
      setCurrentlyActive(false);
    }

    return { existingKey, currentValue };
  };

  const createOrUpdate = async (existingKey: KeyTypes | undefined, currentValue: string) => {
    if (!currentValue.trim().length) {
      return;
    }

    if (existingKey) {
      // lol
      setCommandKeyId(existingKey._id);
      setCurrentKeyName(existingKey.text);
    } else {
      // just create a new one
      const keyId = generateMongoObjectId();
      setCommandKeyId(keyId);
      try {
        // TODO: suggest to create a new key, not just create
        // await createKey.mutateAsync({ keyId, keyName: currentValue.trim() });
        // toast(`Новый ключ был создан`, toastSuccessStyles);
      } catch (error) {
        toast(`Что-то пошло не так, ключ не был создан`, toastErrorStyles);
        setCommandKeyId("");
        setCurrentKeyName("");
        console.error(error);
      }
    }
  };

  const updateKeyOnBlur = ({ value }: { value?: string }) => {
    const existingKey = keyExists({ value });
    createOrUpdate(existingKey?.existingKey, existingKey?.currentValue || "");
  };

  const handleSubmit = ({ value }: { value?: string }) => {
    const existingKey = keyExists({ value });
    createOrUpdate(existingKey?.existingKey, existingKey?.currentValue || "");
  };

  const handleSelect = (index: number) => {
    const value = memoizedKeys[index];
    if (value) {
      setShowKeyModal(false);
      handleSubmit({ value: value.text });
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: memoizedKeys.length, onSelect: handleSelect });

  return (
    <Popover open={showKeyModal} onOpenChange={setShowKeyModal}>
      <PopoverTrigger asChild>
        <div className="flex-grow flex justify-between items-center relative">
          <PlotfieldInput
            type="text"
            ref={currentInput}
            onBlur={() => {
              updateKeyOnBlur({});
              if (onBlur) {
                onBlur();
              }
            }}
            placeholder="Ключ"
            value={currentKeyName}
            onClick={() => {
              if (setCurrentlyActive) {
                setCurrentlyActive(true);
              }
            }}
            onChange={(e) => {
              setShowKeyModal(true);
              setCurrentKeyName(e.target.value);

              if (onChange) {
                onChange(e.target.value);
              }
            }}
            className={`border-[3px] text-text border-border outline-none`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {memoizedKeys?.length ? (
          memoizedKeys?.map((c, i) => (
            <Button
              key={`${c._id}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                handleSelect(i);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {c.text.length > 20 ? c.text.substring(0, 20) + "..." : c.text}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            onClick={() => {
              setShowKeyModal(false);
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            {currentKeyName ? "Создать" : "Пусто"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default KeyPromptsModal;
