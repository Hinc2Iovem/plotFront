import PreviewImage from "@/ui/shared/PreviewImage";

type StoryImgBlockTypes = {
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  imagePreview: string | ArrayBuffer | null;
};

export default function StoryAttributesImgBlock({ imagePreview, setPreview }: StoryImgBlockTypes) {
  return (
    <div className={`w-full h-[247px] p-[10px] border-border border-[1px] rounded-md relative`}>
      <PreviewImage
        imgClasses="object-cover rounded-md absolute max-h-[200px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        divClasses="top-1/2"
        imagePreview={imagePreview}
        setPreview={setPreview}
      />
    </div>
  );
}
