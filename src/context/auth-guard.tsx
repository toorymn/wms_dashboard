import { useCallback, useEffect } from "react";
import { useAuthContext } from "./auth";
import { SplashScreen } from "@/components";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
}

function Container({ children }: Props) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const check = useCallback(() => {
    if (!user) {
      navigate(paths.auth.login, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  if (!user) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
