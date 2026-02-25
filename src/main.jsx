import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "./index.css";
import Layout from "./pages/Layout.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Home from "./pages/Home.jsx";
import AuthContext from "./context/AuthContext.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import ProtectRoutes from "./pages/handleRoutes/ProtectRoutes.jsx";
import Profile from "./pages/Profile.jsx";
import Authorization from "./pages/handleRoutes/Authorization.jsx";
import PostDetails from "./pages/post/PostDetails.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectRoutes>
            <Home />
          </ProtectRoutes>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectRoutes>
            <Profile />
          </ProtectRoutes>
        ),
      },
      {
        path: "/post-details/:postId",
        element: (
          <ProtectRoutes>
            <PostDetails />
          </ProtectRoutes>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Authorization>
            <SignUp />
          </Authorization>
        ),
      },
      {
        path: "sign-in",
        element: (
          <Authorization>
            <SignIn />
          </Authorization>
        ),
      },
    ],
  },
]);

let client = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={client}>
    <AuthContext>
      <HeroUIProvider>
        <ToastProvider toastOffset={10} placement="top-center" />
        <RouterProvider router={routes} />
      </HeroUIProvider>
    </AuthContext>
  </QueryClientProvider>,
);
