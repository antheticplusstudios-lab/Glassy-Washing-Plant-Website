import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Keep route data warm briefly so repeated client-side navigation does not
    // wait on a fresh server round-trip (especially noticeable on mobile).
    defaultPreload: "intent",
    defaultPreloadStaleTime: 30_000,
  });

  return router;
};
