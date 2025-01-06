import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { HoverCardContent } from "@radix-ui/react-hover-card";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosCustomized } from "../../../api/axios";
import useAuth from "../../../hooks/Auth/useAuth";
import { DecodedTypes } from "../RequireAuth";

export default function Login() {
  const { setToken } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const decoded = res.accessToken ? jwtDecode<DecodedTypes>(res.accessToken) : undefined;
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
    <section className="h-screen w-screen flex flex-col items-center justify-center">
      <main className="w-fit rounded-md mx-auto mb-[10px]">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[15px] border-[1px] border-border rounded-md">
          <div className={`px-[30px] flex flex-col`}>
            <h2 className={`text-text font-bold text-[36px] self-end`}>Логин</h2>
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
                    className="absolute w-[35px] right-[.5rem] fill-text -translate-y-1/2 top-1/2 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="absolute w-[35px] right-[.5rem] fill-text -translate-y-1/2 top-1/2 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="self-end flex justify-between items-baseline px-[15px] gap-[30px] pb-[20px]">
            <div className="gap-[5px] flex items-center self-end">
              <HoverCard>
                <HoverCardTrigger className="text-[13px] text-text opacity-60 hover:opacity-100 transition-opacity">
                  Остаться залогиненным?
                </HoverCardTrigger>
                <HoverCardContent className="text-text text-[12px] left-0 border-border border-[1px] bg-secondary px-[10px] w-[200px] py-[10px] rounded-sm z-[10]">
                  <span className="opacity-70">Вам больше не нужно будет логиниться на этом устройстве</span>
                </HoverCardContent>
              </HoverCard>
              <Checkbox checked={stayLoggedIn} onClick={() => setStayLoggedIn((prev) => !prev)} />
            </div>
            <Button
              type="submit"
              className="w-fit bg-brand-gradient self-end px-[25px] text-[20px] text-text py-[10px] rounded-md hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Войти
            </Button>
          </div>
        </form>
      </main>
      <Link
        className="z-0 w-fit text-[13px] mx-auto text-text opacity-50 hover:opacity-100 transition-opacity -translate-x-[calc(50%-10px)]"
        to="/auth/register"
      >
        Нету аккаунта? Регистрация
      </Link>
    </section>
  );
}
