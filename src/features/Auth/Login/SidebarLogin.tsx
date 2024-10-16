export default function SidebarLogin() {
  return (
    <div className="flex items-center gap-[.5rem]">
      <button
        type="button"
        className={`rounded-full text-text-light z-[10] text-[1rem] w-[3rem] text-text-dark-darker bg-primary-darker transition-all h-[3rem] border-[1px] border-secondary shadow-sm shadow-light-gray px-[1rem] py-[.5rem]`}
      >
        1
      </button>
      <h4 className={`text-text-light text-[1.3rem]`}>Личные Данные</h4>
    </div>
  );
}
