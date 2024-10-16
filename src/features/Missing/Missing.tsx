import { useEffect, useState } from "react";
import DivBgColor from "../shared/utilities/DivBgColor";
import { useNavigate } from "react-router-dom";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";

export default function Missing() {
  const { userId } = useGetDecodedJWTValues();
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      if (userId) {
        navigate(`/profile/${userId}`, { replace: true });
      } else {
        navigate("/auth/register");
      }
    }
  }, [seconds, navigate, userId]);

  return (
    <article>
      <DivBgColor bgColor="bg-primary" />
      <h1 className="text-text-light text-[3.5rem] text-center">
        Page wasn't found
      </h1>
      <p className="text-[1.5rem] text-text-light opacity-70">
        You will be redirected in {seconds}
      </p>
    </article>
  );
}
