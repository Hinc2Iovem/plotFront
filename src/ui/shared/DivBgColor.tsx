export default function DivBgColor({
  bgColor = "bg-primary",
}: {
  bgColor?: string;
}) {
  return (
    <div
      className={`fixed z-[-999] top-0 bottom-0 left-0 right-0 ${bgColor}`}
    ></div>
  );
}
