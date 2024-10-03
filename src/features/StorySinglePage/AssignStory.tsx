import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosCustomized } from "../../api/axios";
import { MATCHMEDIA } from "../../const/MATCHMEDIA";
import useGetSingleAssignedStory from "../../hooks/Fetching/Story/useGetSingleAssignedStory";
import useEscapeOfModal from "../../hooks/UI/useEscapeOfModal";
import useMatchMedia from "../../hooks/UI/useMatchMedia";
import LightBox from "../shared/utilities/LightBox";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";

export default function AssignStory() {
  const { storyId } = useParams();
  const { userId: staffId } = useGetDecodedJWTValues();

  const isMobile = useMatchMedia(MATCHMEDIA.Mobile);

  const [showOnDekstop, setShowOnDekstop] = useState(false);
  const [notAssigned, setNotAssigned] = useState(true);
  const [isLightBox, setIsLightBox] = useState(false);

  useEscapeOfModal({ setValue: setShowOnDekstop, value: showOnDekstop });

  const { data } = useGetSingleAssignedStory({
    staffId: staffId ?? "",
    storyId: storyId ?? "",
  });

  const assignStory = useMutation({
    mutationKey: ["assignStory", storyId, staffId],
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/stories/${storyId}/staff/${staffId}/assignWorkers`
      ),
    onMutate: () => {
      setIsLightBox(false);
      setNotAssigned(false);
    },
    onError: () => setNotAssigned(true),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    assignStory.mutate();
  };
  return (
    <>
      {data?.data || !notAssigned ? null : (
        <>
          <div className="flex flex-col gap-[1rem] bg-white rounded-md shadow-sm text-center hover:scale-[1.01] hover:bg-primary-pastel-blue text-gray-700 hover:text-white transition-all">
            <button
              onClick={() => {
                if (isMobile) {
                  setIsLightBox(true);
                } else {
                  setShowOnDekstop((prev) => !prev);
                }
              }}
              className="text-[3rem] p-[1rem] active:scale-[0.98]"
            >
              Стать сценаристом данной истории
            </button>
          </div>

          <form
            className={`${
              showOnDekstop ? "" : "hidden"
            } ml-auto hover:scale-[1.01]`}
            onSubmit={handleSubmit}
          >
            <button className="active:scale-[0.98] px-[1rem] py-[.5rem] text-[2.5rem] text-gray-600 rounded-md shadow-sm bg-white ">
              Вы уверены?
            </button>
          </form>

          <aside
            className={`${
              isLightBox
                ? "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                : "hidden -top-1/2 translate-y-1/2"
            } z-[5] absolute bg-white rounded-md shadow-sm shadow-white  p-[1rem]`}
          >
            <form onSubmit={handleSubmit}>
              <button className="px-[1rem] py-[.5rem] text-[2.5rem] text-gray-600 rounded-md shadow-sm">
                Вы уверены?
              </button>
            </form>
          </aside>
          <LightBox isLightBox={isLightBox} setIsLightBox={setIsLightBox} />
        </>
      )}
    </>
  );
}
