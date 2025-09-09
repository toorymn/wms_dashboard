import { SplashScreen } from "components";
import { MainLayout } from "layouts";
import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import WorkerAccountListPage from "pages/workers";
import CountHomePage from "pages/count";
import CountDetailPage from "pages/count/detail";
import AuthGuard from "@/context/auth-guard";
import ShipmentsPage from "@/pages/shipment";
import PreShipmentPage from "@/pages/label";
import PreShipmentItemsPage from "@/pages/label/detail";

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
    {
      path: "/shipment",
      element: <ShipmentsPage />,
    },
    {
      path: "/label",
      element: <PreShipmentPage />,
    },
    {
      path: "/label/:id",
      element: <PreShipmentItemsPage />,
    },
  ],
};
