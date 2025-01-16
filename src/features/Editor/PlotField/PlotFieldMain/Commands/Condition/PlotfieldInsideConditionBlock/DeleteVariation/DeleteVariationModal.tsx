import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";

type DeleteVariationModalTypes = {
  onClick: () => void;
};

export default function DeleteVariationModal({ onClick }: DeleteVariationModalTypes) {
  return (
    <ContextMenuContent>
      <ContextMenuItem
        onClick={() => {
          onClick();
        }}
      >
        Удалить
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
