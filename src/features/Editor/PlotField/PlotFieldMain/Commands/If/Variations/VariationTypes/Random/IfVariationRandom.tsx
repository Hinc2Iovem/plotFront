import { Button } from "@/components/ui/button";

export default function IfVariationRandom() {
  return (
    <div className="relative w-full">
      <Button type="button" className={`bg-secondary text-text w-full`}>
        Рандом
      </Button>
    </div>
  );
}
