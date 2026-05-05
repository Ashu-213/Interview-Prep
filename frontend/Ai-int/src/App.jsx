
import { RouterProvider } from 'react-router';
import { router } from './appRoutes.jsx';
import { AuthProvider } from './features/auth/authContext.jsx';
import './style.scss';



const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  )
}

export default App