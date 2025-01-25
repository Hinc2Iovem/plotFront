import { toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useCreateKeyInsideCommandKey from "./useCreateKeyInsideCommandKey";

type ActionButtonTypes = {
  plotfieldCommandId: string;
  text: string;
  setCurrentKey: React.Dispatch<
    React.SetStateAction<{
      textValue: string;
      id: string;
    }>
  >;
};

export default function ActionButton({ plotfieldCommandId, text, setCurrentKey }: ActionButtonTypes) {
  const { storyId } = useParams();
  const ref = useRef<HTMLButtonElement>(null);
  const createKey = useCreateKeyInsideCommandKey({
    plotFieldCommandId: plotfieldCommandId,
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        toast.dismiss();
        const keyId = generateMongoObjectId();
        setCurrentKey({ id: keyId, textValue: text });
        createKey.mutate({ keyId, storyId: storyId || "", text });
        toast("Ключ создан", toastSuccessStyles);
      }}
      className={`outline focus-within:bg-accent hover:bg-accent transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
