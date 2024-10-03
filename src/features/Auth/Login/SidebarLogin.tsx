export default function SidebarLogin() {
  return (
    <div className="flex items-center gap-[.5rem]">
      <button
        type="button"
        className={`rounded-full z-[10] text-[1rem] w-[3rem] text-neutral-alabaster bg-primary-light-blue transition-all h-[3rem] border-[1px] border-white shadow-sm shadow-neutral-light-gray px-[1rem] py-[.5rem]`}
      >
        1
      </button>
      <h4 className={`text-white text-[1.3rem]`}>Личные Данные</h4>
    </div>
  );
}
