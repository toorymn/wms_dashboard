import { Navigate, useRoutes } from 'react-router-dom';


import { authRoutes } from './auth';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth routes
      authRoutes,
      mainRoutes,
    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
