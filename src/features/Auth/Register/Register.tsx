import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosCustomized } from "../../../api/axios";
import useAuth from "../../../hooks/Auth/useAuth";
import { DecodedTypes } from "../RequireAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye, EyeClosed } from "lucide-react";
import scriptwriter from "../../../assets/images/Auth/scriptwriter.png";
import translator from "../../../assets/images/Auth/translator.png";
import { toast } from "sonner";

const toastStyles = {
  className: "text-[15px]",
  style: { backgroundColor: "red" },
};

export default function Register() {
  const { setToken } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [role, setRole] = useState("scriptwriter");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const navigate = useNavigate();

  const canSubmit = [login, password, secretKey].every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast("Заполните все поля", toastStyles);
      return;
    }
    try {
      const res = await axiosCustomized
        .post<{ accessToken: string }>("/auth/register", {
          username: login,
          password,
          key: secretKey,
          roles: role,
        })
        .then((r) => r.data);
      const decoded = res.accessToken ? jwtDecode<DecodedTypes>(res.accessToken) : undefined;
      navigate(`/profile/${decoded?.StaffInfo.userId}`, { replace: true });
      setToken({ accessToken: res.accessToken });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast("No Serve Response", toastStyles);
        } else if (error.response?.status === 400) {
          toast("Username or Password is missing", toastStyles);
        } else if (error.response?.status === 401) {
          toast("Wrong Username or Password", toastStyles);
        } else {
          toast("Something Went Wrong", toastStyles);
        }
      }
    }
  };

  return (
    <section className="h-screen w-screen flex flex-col items-center justify-center">
      <main className="w-fit rounded-md mx-auto mb-[10px]">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[15px] border-[1px] border-border rounded-md">
          <div className={`px-[30px] flex flex-col`}>
            <h2 className={`text-heading font-bold text-[36px] self-end`}>Регистрация</h2>
            <div className="flex flex-col gap-[.5rem] w-full relative">
              <Input
                id="username"
                placeholder="username"
                className="w-full outline-0 text-[14px] text-text px-[10px] py-[5px] border-[1px] border-border rounded-md"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <div className="relative w-full">
                <Input
                  id="password"
                  placeholder="password"
                  className="w-full outline-0 text-[14px] text-text px-[10px] py-[5px] pr-[40px] border-[1px] border-border rounded-md"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <EyeClosed
                    onClick={() => setShowPassword(false)}
                    className="absolute w-[35px] right-[.5rem] fill-paragraph -translate-y-1/2 top-1/2 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="absolute w-[35px] right-[.5rem] fill-paragraph -translate-y-1/2 top-1/2 cursor-pointer"
                  />
                )}
              </div>
              <div className="flex justify-between px-[5px] items-center">
                <h3 className="text-heading text-[28px]">Роль: </h3>
                <Button
                  type="button"
                  onClick={() => setRole("translator")}
                  className={`w-[55px] h-[45px] ${
                    role === "translator" ? "bg-brand-gradient" : "bg-text-opposite"
                  } rounded-md active:scale-[.98] transition-all relative`}
                >
                  <img
                    alt="translator"
                    src={translator}
                    className="w-[35px] h-[35px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </Button>
                <Button
                  type="button"
                  onClick={() => setRole("scriptwriter")}
                  className={`w-[55px] h-[45px] ${
                    role === "scriptwriter" ? "bg-brand-gradient" : "bg-text-opposite"
                  } rounded-md active:scale-[.98] transition-all relative`}
                >
                  <img
                    alt="scriptwriter"
                    src={scriptwriter}
                    className="w-[35px] h-[35px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </Button>
              </div>

              <Input
                id="key"
                placeholder="key"
                className="w-full outline-0 text-[14px] text-text px-[10px] py-[5px] pr-[40px] border-[1px] border-border rounded-md"
                type={"text"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          </div>
          <div className="self-end flex justify-between items-baseline px-[15px] gap-[30px] pb-[20px]">
            <div className="gap-[5px] flex items-center self-end">
              <HoverCard>
                <HoverCardTrigger className="text-[13px] text-paragraph opacity-60 hover:opacity-100 transition-opacity">
                  Остаться залогиненным?
                </HoverCardTrigger>
                <HoverCardContent className="text-paragraph text-[12px] left-0 border-border bg-secondary px-[10px] w-[200px] py-[10px] rounded-sm z-[10]">
                  <span className="opacity-70">Вам больше не нужно будет логиниться на этом устройстве</span>
                </HoverCardContent>
              </HoverCard>
              <Checkbox checked={stayLoggedIn} onClick={() => setStayLoggedIn((prev) => !prev)} />
            </div>
            <Button
              type="submit"
              className="w-fit bg-brand-gradient self-end px-[25px] text-[20px] text-white py-[10px] rounded-md hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Войти
            </Button>
          </div>
        </form>
      </main>
      <Link
        className="z-0 w-fit text-[13px] mx-auto text-text opacity-50 hover:opacity-100 transition-opacity -translate-x-3/4"
        to="/auth/login"
      >
        Есть аккаунта? Логин
      </Link>
    </section>
  );
}
