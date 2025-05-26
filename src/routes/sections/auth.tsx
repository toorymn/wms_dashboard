import { SplashScreen } from "components";
import { AuthLayout } from "layouts";
import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import LoginPage from "pages/auth/login";

export const authRoutes: RouteObject = {
  path: "auth",
  element: (
    <Suspense fallback={<SplashScreen />}>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </Suspense>
  ),
  children: [
    {
      path: "login",
      element: <LoginPage />  ,
    },
  ],
};
