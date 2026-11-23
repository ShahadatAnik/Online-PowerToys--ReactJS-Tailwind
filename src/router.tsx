import { createRouter } from "@tanstack/react-router"
import { DefaultErrorComponent } from "@/components/error-boundary"
import { NotFound } from "@/components/not-found"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: NotFound,
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
