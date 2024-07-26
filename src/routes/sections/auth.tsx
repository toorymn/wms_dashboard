import { SplashScreen } from "components";
import {AuthLayout} from "layouts";
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

const LoginPage = lazy(() => import("pages/auth/login"));

export const authRoutes = {
  path: "auth",
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: "login",
      element: (
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      ),
    },
  ],
};
