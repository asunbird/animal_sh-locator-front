import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../Home.jsx";
import Map from "../Map.jsx";
import { About, Info, Contact } from "../About.jsx";
import Error from "../Error.jsx";
import SignIn from "../components/SignIn.jsx";
import SignOut from "../components/SignOut.jsx";
import Registration from "../components/Registration.jsx";
import Favorites from "../Favorites.jsx";

// This functional component acts as the entry point for configuring the application routes.
export const AppRoutes = () => {
  const { token } = useAuth();
  // Access the authentication token using the useAuth hook.
    
    // Define routes accessible to all users.
    const routesForPublic = [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/components/signin",
            element: <SignIn />,
        },
        {
            path: "/components/registration",
            element: <Registration />,
        },
        {
            path: "/favorites",
            element: <Favorites />,
        },
        {
            path: "/map",
            element: <Map />,
        },
        {
            path: "/about",
            element: <About />,
            children: [
                {
                    path: "info",
                    element: <Info />,
                },
                {
                    path: "contact",
                    element: <Contact />,
                },
            ],
        },
        {
            path: "*",
            element: <Error />,
        },
    ];

    // Define routes accessible only to Authenticated users.
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
            children: [
            {
                path: "/",
                element: <div>User Home Page</div>,
            },
            {
                path: "/components/signout",
                element: <SignOut />,
            },
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users.
    const routesForNotAuthenticatedOnly = [
        {
            path: "/components/signin",
            element: <SignIn />,
        },
    ];


    // Combine and conditionally include routes based on authentication status.
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    // The RouterProvider component wraps the router configuration, making it available for the entire application.
    return <RouterProvider router={router} />;
};


