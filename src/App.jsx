
import { AppRoutes } from "./routes"; // It defines the application routes.
import EvolvingBackground from './EvolvingBackground.jsx';
import AuthProvider from "./provider/authProvider.jsx"; // provides the authentication context to the application.



function App() {
  return (
    <AuthProvider>
      <EvolvingBackground>
        <AppRoutes />
      </EvolvingBackground>
    </AuthProvider>
  )
}

export default App;