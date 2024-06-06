import {
	clerkMiddleware,
	createRouteMatcher,
	redirectToSignIn,
} from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./lib/locales";

const intlMiddleware = createMiddleware({
	locales: locales,
	defaultLocale: "en",
});

const isProtectedRoute = createRouteMatcher(["/posts"]);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect();

	// Skip localization for API routes
	if (req.nextUrl.pathname.startsWith("/api")) {
		return NextResponse.next();
	}

	return intlMiddleware(req);
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(trpc)(.*)"],
};
