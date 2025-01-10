import { toastErrorStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useGetSeasonsByStoryId from "../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import useCreateNewSeason from "../../../hooks/Posting/Season/useCreateNewSeason";
import DisplaySeasons from "../DisplaySeasons";

export default function StoryMainContent() {
  const { storyId } = useParams();
  const { data: allSeasonsIds } = useGetSeasonsByStoryId({
    language: "russian",
    storyId: storyId || "",
  });
  return (
    <section className="flex flex-col w-full max-w-[1480px] mx-auto gap-[30px] p-[10px] sm:my-0 my-[10px]">
      <CreateSeasonBlock />
      <div className="grid w-full gap-[5px] mx-auto sm:px-[30px] items-center justify-items-center min-h-fit grid-cols-1 lg:grid-cols-2">
        {allSeasonsIds?.map((si, i) => (
          <DisplaySeasons key={si._id} index={i + 1} {...si} />
        ))}
      </div>
    </section>
  );
}

function CreateSeasonBlock() {
  const { storyId } = useParams();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const createNewSeason = useCreateNewSeason({
    storyId: storyId || "",
    title,
    currentLanguage: "russian",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim().length) {
      toast("У сезона должен быть тайтл", toastErrorStyles);
      return;
    }
    createNewSeason.mutate();

    setShowSeasonModal(false);
    startTransition(() => {
      setTitle("");
    });
  };

  return (
    <Popover
      open={showSeasonModal}
      onOpenChange={(value) => (value ? setShowSeasonModal(true) : setShowSeasonModal(false))}
    >
      <PopoverTrigger className="ml-auto" asChild>
        <Button
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            setShowSeasonModal((prev) => !prev);
          }}
          className={`px-[10px] ${
            showSeasonModal
              ? "bg-accent hover:shadow-accent text-white/80"
              : "bg-brand-gradient hover:shadow-brand-gradient-right text-white"
          } py-[20px] active:scale-[.99] hover:shadow-sm transition-all rounded-md text-[32px]`}
        >
          Создать Сезон
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${
          showSeasonModal ? "" : "hidden"
        } translate-y-[5px] min-w-[500px] z-[2] bg-secondary border-border border-[1px] rounded-sm -translate-x-[10px]`}
      >
        <form className="flex gap-[5px] sm:flex-row flex-col" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Тайтл Сезона"
            className="flex-grow text-[16px] text-text border-border border-[1px] rounded-md px-[10px] py-[5px]"
          />
          <Button className="bg-brand-gradient text-white text-[18px] hover:shadow-brand-gradient-right hover:shadow-sm active:scale-[.99] transition-all">
            Создать
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
