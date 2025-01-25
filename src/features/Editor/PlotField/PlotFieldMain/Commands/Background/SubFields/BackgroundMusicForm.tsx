import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUpdateBackgroundMusicText from "../../../../hooks/Background/useUpdateBackgroundMusicText";
import useGetMusicById from "../../../../hooks/Music/useGetMusicById";
import AllMusicModal, { InitMusicValueTypes } from "../../Music/AllMusicModal";

type BackgroundMusicFormTypes = {
  backgroundId: string;
  musicId: string;
  setCurrentMusicName: React.Dispatch<React.SetStateAction<string>>;
};

export default function BackgroundMusicForm({ backgroundId, musicId, setCurrentMusicName }: BackgroundMusicFormTypes) {
  const { storyId } = useParams();
  const [initMusicValue, setInitMusicValue] = useState<InitMusicValueTypes>({
    musicId: musicId || "",
    musicName: "",
  });

  const { data: music } = useGetMusicById({
    musicId: musicId || "",
  });
  useEffect(() => {
    if (music) {
      setCurrentMusicName(music.musicName);
      setInitMusicValue({
        musicId: music._id,
        musicName: music.musicName,
      });
    }
  }, [music]);

  const updateMusicText = useUpdateBackgroundMusicText({
    storyId: storyId || "",
    backgroundId,
  });

  return (
    <AllMusicModal
      initMusicValue={initMusicValue}
      onBlur={(value) => {
        setCurrentMusicName(value.musicName);
        updateMusicText.mutate({ musicName: value.musicName });
      }}
    />
  );
}
