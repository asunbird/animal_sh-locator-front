import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../Home.jsx";
import Map from "../Map.jsx";
import { About, Info, Contact } from "../About.jsx";
import Error from "../Error.jsx";
import SignIn from "../components/SignIn.jsx";
import SignOut from "../components/SignOut.jsx";
import Registration from "../components/Registration.jsx";
import Favorites from "../Favorites.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/components/signin", element: <SignIn /> },
    { path: "/components/registration", element: <Registration /> },
    { path: "/favorites", element: <Favorites /> },
    { path: "/map", element: <Map /> },
    {
        path: "/about",
        element: <About />,
        children: [
            { path: "info", element: <Info /> },
            { path: "contact", element: <Contact /> },
        ],
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            { path: "/components/signout", element: <SignOut /> },
        ],
    },
    { path: "*", element: <Error /> },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
