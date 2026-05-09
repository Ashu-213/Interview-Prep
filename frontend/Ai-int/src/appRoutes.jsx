import { createBrowserRouter } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/Interview/pages/Home';
import Interview from './features/Interview/pages/Interview';
import Landing from './features/Interview/pages/Landing';
import Protected from './features/auth/components/protected';
import SiteLayout from './layouts/SiteLayout';

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/dashboard",
        element: <Protected><Home /></Protected>
      },
      {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

export default router;
