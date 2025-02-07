import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import Profile from "@/pages/Profile";

const ProtectedLayout = () => {
  const { user } = useUser();
  const routerState = useRouterState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && routerState.location.pathname !== "/login") {
      navigate({ to: "/login", replace: true });
    }
  }, [user, routerState.location.pathname, navigate]);

  return <AppLayout />;
};

const rootRoute = createRootRoute({
  component: ProtectedLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <Navigate to="/" />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  profileRoute,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
});
