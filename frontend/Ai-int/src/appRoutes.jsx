import { Navigate, createBrowserRouter } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/Interview/pages/Home';
import Interview from './features/Interview/pages/Interview';
import Protected from './features/auth/components/protected';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>
  }
]);

export default router;
