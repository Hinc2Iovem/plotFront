import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type UnknownNameActionButtonTypes = {
  setStartAssigningUnknownName: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function UnknownNameActionButton({ setStartAssigningUnknownName }: UnknownNameActionButtonTypes) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        setStartAssigningUnknownName(true);
        toast.dismiss();
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white text-black transition-all`}
      ref={ref}
    >
      Начать
    </Button>
  );
}
