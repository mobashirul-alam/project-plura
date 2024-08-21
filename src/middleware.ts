import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/agency/sign-in(.*)",
    "/agency/sign-up(.*)",
    "/site",
    "/api/uploadthing",
]);

const afterAuth = (
    auth: any,
    req: {
        url: string | URL | undefined;
        headers: any;
        nextUrl: any;
    }
) => {
    // rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // if subdomain exists
    const customSubDomain = hostname
        .get("host")
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

    if (customSubDomain) {
        return NextResponse.rewrite(
            new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
        );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
        return NextResponse.rewrite(new URL("/agency/sign-in", req.url));
    }

    if (
        url.pathname === "/site" &&
        url.host === process.env.NEXT_PUBLIC_DOMAIN
    ) {
        return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
        url.pathname.startsWith("/agency") ||
        url.pathname.startsWith("/subaccount")
    ) {
        return NextResponse.rewrite(
            new URL(`${pathWithSearchParams}`, req.url)
        );
    }
};

export default clerkMiddleware((auth, req) => {
    const url = req.nextUrl;

    if (!isPublicRoute(req)) {
        auth().protect();
    }

    if (url.pathname === "/") {
        return NextResponse.rewrite(new URL("/site", req.url));
    }
    afterAuth(auth, req);
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
