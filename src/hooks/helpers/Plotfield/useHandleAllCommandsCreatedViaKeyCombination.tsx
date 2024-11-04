import useCreateAchievementViaKeyCombination from "./CommandsHooks/useCreateAchievementViaKeyCombination";
import useCreateAmbientViaKeyCombination from "./CommandsHooks/useCreateAmbientViaKeyCombination";
import useCreateAuthorViaKeyCombination from "./CommandsHooks/useCreateAuthorViaKeyCombination";
import useCreateBackgroundViaKeyCombination from "./CommandsHooks/useCreateBackgroundViaKeyCombination";
import useCreateCallViaKeyCombination from "./CommandsHooks/useCreateCallViaKeyCombination";
import useCreateCertainCharacterViaKeyCombination from "./CommandsHooks/useCreateCertainCharacterViaKeyCombination";
import useCreateCharacterViaKeyCombination from "./CommandsHooks/useCreateCharacterViaKeyCombination";
import useCreateChoiceViaKeyCombination from "./CommandsHooks/useCreateChoiceViaKeyCombination";
import useCreateCommentViaKeyCombination from "./CommandsHooks/useCreateCommentViaKeyCombination";
import useCreateConditionViaKeyCombination from "./CommandsHooks/useCreateConditionViaKeyCombination";
import useCreateCutSceneViaKeyCombination from "./CommandsHooks/useCreateCutSceneViaKeyCombination";
import useCreateEffectViaKeyCombination from "./CommandsHooks/useCreateEffectViaKeyCombination";
import useCreateGetItemViaKeyCombination from "./CommandsHooks/useCreateGetItemViaKeyCombination";
import useCreateHintViaKeyCombination from "./CommandsHooks/useCreateHintViaKeyCombination";
import useCreateIfViaKeyCombination from "./CommandsHooks/useCreateIfViaKeyCombination";
import useCreateKeyViaKeyCombination from "./CommandsHooks/useCreateKeyViaKeyCombination";
import useCreateMoveViaKeyCombination from "./CommandsHooks/useCreateMoveViaKeyCombination";
import useCreateMusicViaKeyCombination from "./CommandsHooks/useCreateMusicViaKeyCombination";
import useCreateNameViaKeyCombination from "./CommandsHooks/useCreateNameViaKeyCombination";
import useCreateNotifyViaKeyCombination from "./CommandsHooks/useCreateNotifyViaKeyCombination";
import useCreateSoundViaKeyCombination from "./CommandsHooks/useCreateSoundViaKeyCombination";
import useCreateSuitViaKeyCombination from "./CommandsHooks/useCreateSuitViaKeyCombination";
import useCreateWaitViaKeyCombination from "./CommandsHooks/useCreateWaitViaKeyCombination";
import useCreateWardrobeViaKeyCombination from "./CommandsHooks/useCreateWardrobeViaKeyCombination";

type HandleAllCommandsCreatedViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useHandleAllCommandsCreatedViaKeyCombination({
  topologyBlockId,
}: HandleAllCommandsCreatedViaKeyCombinationTypes) {
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
