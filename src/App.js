import Login from "./components/auth/login/index";


import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/auth/register";
import  Profile from "./components/profile/profile"
import Accueil from "./components/accueil";
function App() {
  const routesArray = [
    {
      path: "*",
      element: <Accueil />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/profile",
      element: <Profile />
    }


  ];
  let routesElement = useRoutes(routesArray);
  return (
      <AuthProvider>
        <div className="w-full h-screen flex flex-col">{routesElement}</div>
      </AuthProvider>
  );
}

export default App;