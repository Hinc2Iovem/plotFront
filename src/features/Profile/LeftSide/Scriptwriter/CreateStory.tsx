import { toastErrorStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useCreateStory from "../../../../hooks/Posting/Story/useCreateStory";
import PreviewImage from "../../../../ui/shared/PreviewImage";
import { handleUploadeImg } from "../../../../utils/handleUploadImg";

export default function CreateStory() {
  const [storyTitle, setStoryTitle] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [storyDescription, setStoryDescription] = useState("");
  const [storyGenre, setStoryGenre] = useState("");
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [imgPreviewLink, setImgPreviewLink] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  const createStory = useCreateStory({
    currentLanguage: "russian",
    description: storyDescription,
    genres: storyGenre,
    imgUrl: imgPreviewLink,
    title: storyTitle,
  });

  console.log(imgUploading);

  useEffect(() => {
    if (preview) {
      setImgUploading(true);
      handleUploadeImg({ preview })
        .then((r) => {
          setImgPreviewLink(r);
          setImgUploading(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setImgUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const handleCreateStory = async () => {
    if (!storyTitle.trim().length || !storyDescription.trim().length || !storyGenre.trim().length) {
      toast("Тайтл, описание или жанр отсутствуют", toastErrorStyles);
      return;
    }

    try {
      setShowDialog(false);
      createStory.mutate();
    } catch (error) {
      console.error(error);
      toast("Упс что-то пошло не так", toastErrorStyles);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={(open) => (open ? setShowDialog(true) : setShowDialog(false))}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setShowDialog(true);
            setStoryTitle("");
            setStoryDescription("");
            setStoryGenre("");
            setImgPreviewLink("");
            setPreview("");
          }}
          className={`text-[15px] mb-[10px] text-white hover:shadow-brand-gradient-right hover:shadow-sm outline-none active:scale-[0.99] w-full bg-brand-gradient transition-all py-[20px] px-[10px] rounded-md`}
        >
          Создать Историю
        </Button>
      </DialogTrigger>
      <DialogContent>
        <PreviewImage
          imagePreview={preview}
          setPreview={setPreview}
          imgClasses="w-full h-full object-cover rounded-md"
          divClasses="h-[150px] rounded-md shadow-sm relative"
        />
        <form
          className="flex flex-col gap-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateStory();
          }}
        >
          <Input
            type="text"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            className="w-full text-text text-[16px] px-[10px] py-[5px] border-border border-[1px] rounded-md transition-all"
            placeholder="Тайтл Истории"
          />
          <Input
            type="text"
            value={storyGenre}
            onChange={(e) => setStoryGenre(e.target.value)}
            className="w-full text-text text-[15px] px-[10px] py-[5px] border-border border-[1px] rounded-md transition-all"
            placeholder="Жанры Истории"
          />
          <Textarea
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
            className="w-full text-text text-[14px] max-h-[100px] px-[10px] py-[5px] border-border border-[1px] rounded-md transition-all"
            placeholder="Описание Истории"
          />
          <Button
            className={`w-full text-white hover:shadow-brand-gradient-right bg-brand-gradient hover:shadow-sm px-[10px] py-[20px] text-[15px] rounded-md active:scale-[0.99] transition-all`}
          >
            Создать
          </Button>
        </form>
        {/* <SyncLoad
          className="bg-secondary shadow-md rounded-sm top-[1rem] right-[1rem]"
          conditionToLoading={imgUploading}
          conditionToStart={!imgUploading}
        /> */}
      </DialogContent>
    </Dialog>
  );
}
