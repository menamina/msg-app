import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Index from "./components/index";
import Login from "./components/login";
import Signup from "./components/signup";
import Hub from "./components/hub";
import Contacts from "./components/contacts";
import FriendReq from "./components/friendReq";
import NewMsg from "./components/newMsg";
import Settings from "./components/settings";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/hub",
        element: <Hub />,
        children: [
          { path: "/contacts", element: <Contacts /> },
          { path: "/friend-requests", element: <FriendReq /> },
          { path: "/new", element: <NewMsg /> },
          { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={routes}></RouterProvider>
  </React.StrictMode>,
);
