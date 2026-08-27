import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { Footer, Header, PageTransition } from "@/components/site-shell";
import { ScrollProgress } from "@/components/motion-primitives";
import { AuthProvider } from "@/lib/auth-context";
import { MotionPrefsProvider } from "@/lib/motion-prefs";
import { organizationSchema } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 / Not found</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold">This page went off-grain.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for is not on this floor.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elev-1"
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-outline bg-background px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Glassy Washing Plant | Garment Washing & Finishing in Bangladesh" },
      {
        name: "description",
        content:
          "Garment washing plant in Bangladesh providing garment washing, denim washing, dyeing, dry process and finishing services in Dhaka.",
      },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "theme-color", content: "#0b5d8f" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glassy Washing Plant" },
      { property: "og:title", content: "Glassy Washing Plant | Garment Washing & Finishing in Bangladesh" },
      {
        property: "og:description",
        content:
          "Garment washing plant in Bangladesh providing garment washing, denim washing, dyeing, dry process and finishing services in Dhaka.",
      },
      { property: "og:image", content: "https://glassy-washing-plant.vercel.app/og-image.jpg?v=2" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1527" },
      { property: "og:image:alt", content: "Glassy Washing Plant logo" },
      { property: "og:locale", content: "en_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Glassy Washing Plant — Garment Washing, Dyeing & Finishing in Dhaka" },
      { name: "twitter:description", content: "Garment washing, dyeing and finishing built for quality at commercial scale." },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionPrefsProvider>
        <AuthProvider>
          <ScrollProgress />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <Header />
          <PageTransition>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </PageTransition>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </MotionPrefsProvider>
    </QueryClientProvider>
  );
}
