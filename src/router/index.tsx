import React, { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import NewContact from "@/views/contacts/newContact";
import Group from "@/views/contacts/group";
const Login = lazy(() => import("../views/login/login"));
const Register = lazy(() => import("../views/login/register"));
const Meeting = lazy(() => import("@/views/meeting"));
const Messages = lazy(() => import("@/views/messages"));
const Contacts = lazy(() => import("@/views/contacts"));
const Setting = lazy(() => import("@/views/setting"));
const AccountSetting = lazy(() => import("@/views/setting/account"));
const SystemSetting = lazy(() => import("@/views/setting/system"));
const OtherSetting = lazy(() => import("@/views/setting/other"));
const NotFoundPage = lazy(() => import("@/views/notFoundPage"));
import Legacy from "@/views/meeting/legacy";
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/messages" />,
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
    path: "/messages",
    element: <Messages />,
  },

  {
    path: "/meeting",
    element: <Meeting />,
  },
  {
    path: "/legacy",
    element: <Legacy />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
    children: [
      { path: "new", element: <NewContact /> },
      { path: "group", element: <Group /> },
    ],
  },
  {
    path: "/setting",
    element: <Setting />,
    children: [
      { path: "account", element: <AccountSetting />, index: true },
      { path: "system", element: <SystemSetting /> },
      { path: "other", element: <OtherSetting /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
