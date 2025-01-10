import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import plus from "../../assets/images/shared/add.png";

type PreviewImage = {
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  imagePreview: string | ArrayBuffer | null;
  divClasses?: string;
  imgClasses: string;
  children?: React.ReactNode;
};

export default function PreviewImage({ setPreview, imagePreview, divClasses, imgClasses, children }: PreviewImage) {
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      const file = new FileReader();

      file.onload = function () {
        setPreview(file.result);
      };

      file.readAsDataURL(acceptedFiles[0]);
    },
    [setPreview]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  return (
    <>
      {!imagePreview ? (
        <div {...getRootProps()} className={`cursor-pointer ${divClasses ? divClasses : ""}`}>
          <input type="file" name="Image" id="image" {...getInputProps()} />
          <img
            draggable={false}
            src={imagePreview ? (imagePreview as string) : plus}
            alt="addImage"
            className={`${
              imagePreview
                ? `${imgClasses}`
                : "absolute w-[55px] h-[55px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            }`}
          />
          {children ? children : ""}
        </div>
      ) : (
        <div {...getRootProps()} className={`cursor-pointer ${divClasses ? divClasses : ""}`}>
          <input type="file" name="Image" id="image" {...getInputProps()} />
          <img
            draggable={false}
            src={imagePreview ? (imagePreview as string) : plus}
            alt="addImage"
            className={`${
              imagePreview
                ? `${imgClasses}`
                : "absolute w-[55px] h-[55px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            }`}
          />
          {children ? children : ""}
        </div>
      )}
    </>
  );
}
