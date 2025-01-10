import { SelectProps } from "@radix-ui/react-select";
import { Select } from "./select";

export default function SelectWithBlur({ children, onValueChange, ...props }: SelectProps) {
  return (
    <Select
      {...props}
      onValueChange={(value) => {
        if (onValueChange) {
          onValueChange(value);
        }
        setTimeout(() => {
          if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
          }
        }, 0);
      }}
    >
      {children}
    </Select>
  );
}
