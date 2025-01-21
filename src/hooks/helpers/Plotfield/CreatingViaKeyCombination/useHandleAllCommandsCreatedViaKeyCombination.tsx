import useCreateAchievementViaKeyCombination from "./allHooks/useCreateAchievementViaKeyCombination";
import useCreateAmbientViaKeyCombination from "./allHooks/useCreateAmbientViaKeyCombination";
import useCreateAuthorViaKeyCombination from "./allHooks/useCreateAuthorViaKeyCombination";
import useCreateBackgroundViaKeyCombination from "./allHooks/useCreateBackgroundViaKeyCombination";
import useCreateBlankViaKeyCombination from "./allHooks/useCreateBlankViaKeyCombination";
import useCreateCallViaKeyCombination from "./allHooks/useCreateCallViaKeyCombination";
import useCreateCertainCharacterViaKeyCombination from "./allHooks/useCreateCertainCharacterViaKeyCombination";
import useCreateCharacterViaKeyCombination from "./allHooks/useCreateCharacterViaKeyCombination";
import useCreateChoiceViaKeyCombination from "./allHooks/useCreateChoiceViaKeyCombination";
import useCreateCommentViaKeyCombination from "./allHooks/useCreateCommentViaKeyCombination";
import useCreateConditionViaKeyCombination from "./allHooks/useCreateConditionViaKeyCombination";
import useCreateCutSceneViaKeyCombination from "./allHooks/useCreateCutSceneViaKeyCombination";
import useCreateEffectViaKeyCombination from "./allHooks/useCreateEffectViaKeyCombination";
import useCreateGetItemViaKeyCombination from "./allHooks/useCreateGetItemViaKeyCombination";
import useCreateHintViaKeyCombination from "./allHooks/useCreateHintViaKeyCombination";
import useCreateIfViaKeyCombination from "./allHooks/useCreateIfViaKeyCombination";
import useCreateKeyViaKeyCombination from "./allHooks/useCreateKeyViaKeyCombination";
import useCreateMoveViaKeyCombination from "./allHooks/useCreateMoveViaKeyCombination";
import useCreateMusicViaKeyCombination from "./allHooks/useCreateMusicViaKeyCombination";
import useCreateNameViaKeyCombination from "./allHooks/useCreateNameViaKeyCombination";
import useCreateNotifyViaKeyCombination from "./allHooks/useCreateNotifyViaKeyCombination";
import useCreateSoundViaKeyCombination from "./allHooks/useCreateSoundViaKeyCombination";
import useCreateSuitViaKeyCombination from "./allHooks/useCreateSuitViaKeyCombination";
import useCreateWaitViaKeyCombination from "./allHooks/useCreateWaitViaKeyCombination";
import useCreateWardrobeViaKeyCombination from "./allHooks/useCreateWardrobeViaKeyCombination";

type HandleAllCommandsCreatedViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useHandleAllCommandsCreatedViaKeyCombination({
  topologyBlockId,
}: HandleAllCommandsCreatedViaKeyCombinationTypes) {
  useCreateBlankViaKeyCombination({ topologyBlockId });

  useCreateAchievementViaKeyCombination({ topologyBlockId });

  useCreateAmbientViaKeyCombination({ topologyBlockId });

  useCreateBackgroundViaKeyCombination({ topologyBlockId });

  useCreateCallViaKeyCombination({ topologyBlockId });

  useCreateChoiceViaKeyCombination({ topologyBlockId });

  useCreateCommentViaKeyCombination({ topologyBlockId });

  useCreateCutSceneViaKeyCombination({ topologyBlockId });

  useCreateEffectViaKeyCombination({ topologyBlockId });

  useCreateGetItemViaKeyCombination({ topologyBlockId });

  useCreateIfViaKeyCombination({ topologyBlockId });

  useCreateKeyViaKeyCombination({ topologyBlockId });

  useCreateMoveViaKeyCombination({ topologyBlockId });

  useCreateMusicViaKeyCombination({ topologyBlockId });

  useCreateNameViaKeyCombination({ topologyBlockId });

  useCreateSoundViaKeyCombination({ topologyBlockId });

  useCreateSuitViaKeyCombination({ topologyBlockId });

  useCreateWaitViaKeyCombination({ topologyBlockId });

  useCreateWardrobeViaKeyCombination({ topologyBlockId });

  useCreateAuthorViaKeyCombination({ topologyBlockId });

  useCreateHintViaKeyCombination({ topologyBlockId });

  useCreateNotifyViaKeyCombination({ topologyBlockId });

  useCreateCharacterViaKeyCombination({ topologyBlockId });

  useCreateConditionViaKeyCombination({ topologyBlockId });

  useCreateCertainCharacterViaKeyCombination({ topologyBlockId });
}
