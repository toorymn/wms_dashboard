import { SplashScreen } from "components";
import { MainLayout } from "layouts";
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

const HomePage = lazy(() => import("pages"));
const AccountListPage = lazy(() => import("pages/account"));

export const mainRoutes = {
  path: "/",
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: "",
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
    },
    {
      path: "account",
      element: (
        <MainLayout>
          <AccountListPage />
        </MainLayout>
      ),
    },
  ],
};
