import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { ProfilePage } from "./pages/Profile/profilePage";
import { FavouritesPage } from "./pages/Favourites/FavouritesPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { AddPlacePage } from "./pages/AddPlace/AddPlacePage";
// import { LandingPage } from "./pages/LandingPage";

import { Layout } from "./components/Navbar/Layout";
// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <FeedPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },

      {
        path: "/favourites",
        element: <FavouritesPage />,
      },
      {
        path: "/add-place",
        element: <AddPlacePage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
