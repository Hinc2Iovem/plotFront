import translator from "../../../assets/images/Auth/translator.png";
import scriptwriter from "../../../assets/images/Auth/scriptwriter.png";

type RegisterFormSecondPageTypes = {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  currentPage: number;
  canSubmit: boolean;
};

export default function RegisterFormSecondPage({
  currentPage,
  canSubmit,
  setCurrentPage,
  role,
  setRole,
}: RegisterFormSecondPageTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <div
      className={`${
        currentPage === 2 ? "" : "hidden"
      } mx-auto flex flex-col gap-[3rem] h-full `}
    >
      <div className="w-full flex flex-col text-center">
        <h2
          className={`${
            theme === "light" ? "text-dark-dark-blue" : "text-text-light"
          } font-medium text-[3rem]`}
        >
          Выберите роль
        </h2>
        <p className="text-text-light text-[1.3rem]">
          Роль будет решать доступность функционала для вас
        </p>
      </div>
      <div className="flex flex-col gap-[2rem]">
        <button
          type="button"
          onClick={() => setRole("scriptwriter")}
          className={`${
            role === "scriptwriter"
              ? "bg-primary-darker text-text-light"
              : "bg-secondary text-text-dark"
          } md:w-[20rem] w-full text-[2rem] justify-center mx-auto active:scale-[0.98] transition-all hover:bg-primary-darker hover:text-text-light flex items-center gap-[.5rem] shadow-md px-[1rem] py-[.5rem] rounded-md`}
        >
          <p>Сценарист</p>
          <img
            src={scriptwriter}
            alt="Scriptwriter"
            className="w-[2.5rem] h-[2.5rem]"
          />
        </button>
        <button
          type="button"
          onClick={() => setRole("translator")}
          className={`${
            role === "translator"
              ? "bg-dark-blue text-text-light"
              : "bg-secondary text-text-dark"
          } md:w-[20rem] w-full text-[2rem] justify-center mx-auto active:scale-[0.98] transition-all hover:bg-dark-blue hover:text-text-light flex items-center gap-[.5rem] shadow-md px-[1rem] py-[.5rem] rounded-md`}
        >
          <p>Переводчик</p>
          <img
            src={translator}
            alt="Translator"
            className="w-[2.5rem] h-[2.5rem]"
          />
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(1)}
          className="w-fit text-[1.3rem] self-start px-[1rem] text-text-dark hover:text-text-light py-[.5rem] rounded-md shadow-md bg-secondary hover:bg-primary transition-colors active:scale-[0.98]"
          type="button"
        >
          Предыдущая
        </button>
        <button
          disabled={!canSubmit}
          type="submit"
          className={`w-fit text-[1.3rem] self-start px-[1rem] py-[.5rem] rounded-md shadow-md  ${
            canSubmit
              ? "hover:bg-dark-blue bg-primary-darker text-text-light "
              : " bg-primary text-text-dark hover:cursor-not-allowed"
          }  active:scale-[0.98] transition-all`}
        >
          Завершить
        </button>
      </div>
    </div>
  );
}
