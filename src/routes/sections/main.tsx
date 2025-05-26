import { SplashScreen } from "components";
import { MainLayout } from "layouts";
import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import WorkerAccountListPage from "pages/workers";
import CountHomePage from "pages/count";
import CountDetailPage from "pages/count/detail";
import AuthGuard from "@/context/auth-guard";

export const mainRoutes: RouteObject = {
  path: "/",
  element: (
    <Suspense fallback={<SplashScreen />}>
      <AuthGuard>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </AuthGuard>
    </Suspense>
  ),
  children: [
    {
      path: "/",
      element: <CountHomePage />,
    },
    {
      path: "/count/:id",
      element: <CountDetailPage />,
    },
    {
      path: "/account",
      element: <WorkerAccountListPage />,
    },
  ],
};
