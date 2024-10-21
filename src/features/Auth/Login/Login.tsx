import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosCustomized } from "../../../api/axios";
import visibilityOff from "../../../assets/images/Auth/eyeOff.png";
import visibility from "../../../assets/images/Auth/eyeOn.png";
import useAuth from "../../../hooks/Auth/useAuth";
import { DecodedTypes } from "../RequireAuth";
import Sidebar from "../Sidebar";

export default function Login() {
  const { setToken } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = localStorage.getItem("theme");
  const navigate = useNavigate();

  const canSubmit = [login, password].every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      console.log("Can't submit now");
      return;
    }
    try {
      const res = await axiosCustomized
        .post<{ accessToken: string }>("/auth", {
          username: login,
          password,
        })
        .then((r) => r.data);
      const decoded = res.accessToken
        ? jwtDecode<DecodedTypes>(res.accessToken)
        : undefined;
      navigate(`/profile/${decoded?.StaffInfo.userId}`, { replace: true });
      setToken({ accessToken: res.accessToken });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.log("No Serve Response");
        } else if (error.response?.status === 400) {
          console.log("Username or Password is missing");
        } else if (error.response?.status === 401) {
          console.log("Wrong Username or Password");
        } else {
          console.log("Something Went Wrong");
        }
      }
    }
  };
  return (
    <section className="md:h-screen w-screen flex md:items-center justify-center">
      <main className="w-full max-w-[80rem] md:max-w-[65rem] md:mx-[1rem] md:bg-secondary flex md:flex-row flex-col md:h-[30rem] overflow-x-hidden shadow-sm md:rounded-md">
        <Sidebar />
        <form
          onSubmit={handleSubmit}
          className="md:h-full p-[1rem] w-3/4 mx-auto md:bg-transparent bg-secondary md:rounded-none rounded-md md:relative absolute md:top-0 md:left-auto md:translate-x-0 top-[5rem] left-1/2 -translate-x-1/2"
        >
          <div className={`mx-auto flex flex-col gap-[2rem]  mb-[2rem]`}>
            <div className="w-full flex flex-col text-center">
              <h2
                className={`${
                  theme === "light" ? "text-dark-dark-blue" : "text-text-light"
                } font-medium text-[3rem]`}
              >
                Личные данные
              </h2>
              <p className="text-neutral-600 text-[1.3rem]">
                Введите ваш логин и пароль
              </p>
            </div>
            <div className="flex flex-col gap-[.5rem] w-full relative">
              <label
                htmlFor="username"
                className="text-[1.3rem] bg-secondary p-[.1rem] rounded-md text-neutral-600 absolute left-[1rem] top-[-1rem]"
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
                className="text-[1.3rem] bg-secondary p-[.1rem] rounded-md text-neutral-600 absolute left-[1rem] top-[-1rem]"
              >
                Пароль
              </label>
              <input
                id="password"
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
          </div>
          <div className="flex justify-between flex-col">
            <Link
              className="md:block hidden w-fit text-[1.3rem] hover:text-text-light transition-colors text-text-dark"
              to="/auth/register"
            >
              Всё ещё нету аккаунта? Регистрация
            </Link>
            <button
              type="submit"
              className="w-fit self-end px-[1rem] text-[1.3rem] py-[.5rem] rounded-md shadow-md bg-primary-darker text-text-dark hover:text-text-light active:scale-[0.98] transition-all"
            >
              Войти
            </button>
          </div>
        </form>
        <Link
          className="block md:hidden w-fit absolute bottom-[33rem] text-[1.3rem] hover:text-text-light transition-colors text-text-dark left-1/2 -translate-x-1/2"
          to="/auth/register"
        >
          Всё ещё нету аккаунта? Регистрация
        </Link>
      </main>
    </section>
  );
}
