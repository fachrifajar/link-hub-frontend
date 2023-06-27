import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store/index";

// const App = lazy(() => import("./App.jsx"));
// const Register = lazy(() => import("./pages/auth/register.jsx"));

import App from "./App.jsx";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Google from "./pages/auth/google";
import Admin from "./pages/admin";
import AdminItem from "./pages/adminItem";
import Appearance from "./pages/appearance";
import Share from "./pages/share";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       {lazy(() => import("./App.jsx"))}
  //     </Suspense>
  //   ),
  // },
  // {
  //   path: "/register",
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       {lazy(() => import("./pages/auth/register.jsx"))}
  //     </Suspense>
  //   ),
  // },

  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <Google />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/post/:id",
    element: <AdminItem />,
  },
  {
    path: "/admin/appearance/:id",
    element: <Appearance />,
  },
  {
    path: "/:id",
    element: <Share />,
  },
]);

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
