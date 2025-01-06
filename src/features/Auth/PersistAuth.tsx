import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/Auth/useAuth";
import useRefreshToken from "../../hooks/Auth/useRefresh";
import { Toaster } from "@/components/ui/sonner";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !token?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Outlet />
          <Toaster />
        </>
      )}
    </>
  );
}
