
import { RouterProvider } from 'react-router';
import { router } from './appRoutes.jsx';
import { AuthProvider } from './features/auth/authContext.jsx';
import './style.scss';
import { InterviewProvider } from './features/Interview/interviewContext.jsx';


const App = () => {
  return (
    <div>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>  
      </AuthProvider>
    </div>
  )
}

export default App