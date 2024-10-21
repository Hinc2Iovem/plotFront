import { useState } from "react";
import { Link } from "react-router-dom";
import visibility from "../../../assets/images/Auth/eyeOn.png";
import visibilityOff from "../../../assets/images/Auth/eyeOff.png";

type RegisterFormFirstPageTypes = {
  setLogin: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setSecretKey: React.Dispatch<React.SetStateAction<string>>;
  login: string;
  password: string;
  secretKey: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
};

export default function RegisterFormFirstPage({
  login,
  setLogin,
  password,
  setPassword,
  secretKey,
  setSecretKey,
  currentPage,
  setCurrentPage,
}: RegisterFormFirstPageTypes) {
  const [showPassword, setShowPassword] = useState(false);
  const theme = localStorage.getItem("theme");
  return (
    <div
      className={`${
        currentPage === 1 ? "" : "hidden"
      } mx-auto flex flex-col gap-[2rem]`}
    >
      <div className="w-full flex flex-col text-center">
        <h2
          className={`${
            theme === "light" ? "text-dark-dark-blue" : "text-text-light"
          } font-medium text-[3rem]`}
        >
          Личные данные
        </h2>
        <p className="text-text-light opacity-70 text-[1.3rem]">
          Введите ваш логин, пароль и код для регистрации
        </p>
      </div>
      <div className="flex flex-col gap-[.5rem] w-full relative">
        <label
          htmlFor="username"
          className="text-[1.2rem] bg-secondary p-[.1rem] rounded-md text-neutral-600 absolute left-[1rem] top-[-1rem]"
        >
          Логин
        </label>
        <input
          id="username"
          className="w-full outline-0 text-[1.3rem] text-text-light px-[1rem] py-[.8rem] border-[1px] border-primary-darker rounded-md border-dotted"
          type="text"
          value={login}
          autoComplete={"off"}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[.5rem] w-full relative">
        <label
          htmlFor="password"
          className="text-[1.2rem] bg-secondary p-[.1rem] rounded-md text-neutral-600 absolute left-[1rem] top-[-1rem]"
        >
          Пароль
        </label>
        <input
          id="password"
          autoComplete="off"
          className="w-full outline-0 text-[1.3rem] text-text-light px-[1rem] py-[.8rem] border-[1px] border-primary-darker rounded-md border-dotted"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {showPassword ? (
          <img
            src={visibility}
            alt="EyeOpen"
            onClick={() => setShowPassword(false)}
            className="absolute w-[2.2rem] right-[.5rem] -translate-y-1/2 top-1/2 cursor-pointer"
          />
        ) : (
          <img
            src={visibilityOff}
            alt="EyeClosed"
            onClick={() => setShowPassword(true)}
            className="absolute w-[2.2rem] right-[.5rem] -translate-y-1/2 top-1/2 cursor-pointer"
          />
        )}
      </div>
      <div className="flex flex-col gap-[.5rem] w-full relative">
        <label
          htmlFor="secretKey"
          className="text-[1.2rem] bg-secondary p-[.1rem] rounded-md text-neutral-600 absolute left-[1rem] top-[-1rem]"
        >
          Код
        </label>
        <input
          id="secretKey"
          className="w-full outline-0 text-[1.3rem] text-text-light px-[1rem] py-[.8rem] border-[1px] border-primary-darker rounded-md border-dotted"
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>

      <button
        onClick={() => setCurrentPage(2)}
        className="w-fit text-[1.3rem] self-end px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary hover:bg-primary text-text-dark hover:text-text-light transition-colors active:scale-[0.98]"
        type="button"
      >
        Следующая
      </button>

      <Link
        className="text-[1.3rem] w-fit hover:text-text-dark transition-colors text-text-light"
        to="/auth/login"
      >
        Уже есть аккаунт? Логин
      </Link>
    </div>
  );
}
