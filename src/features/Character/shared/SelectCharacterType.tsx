import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";

const AllCharacterTypes: AllCharacterRusVariationTypes[] = ["Все", "Главный Герой", "Второстепенные", "Третий План"];
const AllCharacterWithoutAllTypes: AllCharacterRusVariationWithoutAllTypes[] = [
  "Главный Герой",
  "Второстепенный",
  "Третий План",
];

export type AllCharacterRusVariationTypes = "Все" | "Главный Герой" | "Второстепенные" | "Третий План";
export type AllCharacterRusVariationWithoutAllTypes = "Главный Герой" | "Второстепенный" | "Третий План";

type SelectCharacterTypes<T> = {
  withAll: boolean;
  onValueChange: (v: T) => void;
  triggerClasses: string;
  valueClasses: string;
  characterType?: "maincharacter" | "minorcharacter" | "emptycharacter";
};

export default function SelectCharacterType<T>({
  withAll,
  triggerClasses,
  valueClasses,
  characterType,
  onValueChange,
}: SelectCharacterTypes<T>) {
  const array = withAll ? AllCharacterTypes : AllCharacterWithoutAllTypes;

  return (
    <SelectWithBlur
      value={characterType || ""}
      onValueChange={(v) => {
        onValueChange(v as T);
      }}
    >
      <SelectTrigger className={triggerClasses}>
        <SelectValue placeholder="Тип Персонажа" onBlur={(v) => v.currentTarget.blur()} className={valueClasses} />
      </SelectTrigger>

      <SelectContent>
        {array.map((pv) => {
          return (
            <SelectItem
              key={pv}
              value={
                pv === "Все"
                  ? "all"
                  : pv === "Главный Герой"
                  ? "maincharacter"
                  : pv === "Третий План"
                  ? "emptycharacter"
                  : "minorcharacter"
              }
              className={`capitalize w-full`}
            >
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
