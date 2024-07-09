import { sequence } from "astro:middleware";

import { publicRoutes } from "../config/routes";

async function validationRoute (context, next, request) {
    const currentURL = new URL(context.request.url)
    let isAuthenticated = context.request.headers.get('Cookie')?.includes('user_id')

    if (publicRoutes.includes(currentURL.pathname)) {
        return next()
    }

    if (!isAuthenticated) {
        return new Response(null, {
            status: 401,
            headers: {
                Location: '/login'
            }
        });
    }

    next()
}

export const onRequest = sequence(validationRoute);