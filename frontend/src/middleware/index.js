import { sequence } from "astro:middleware";

import { publicRoutes } from "../config/routes";

async function validationRoute (context, next, request) {
    const currentURL = new URL(context.request.url)
    let isAuthenticated = context.request.headers.get('Cookie')?.includes('user_id')

    console.log('Current URL:', currentURL.pathname)
    if (publicRoutes.includes(currentURL.pathname)) {
        return next()
    }

    if (!isAuthenticated) {
        console.log('User is not authenticated')
        
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/login'
            }
        });
    }

    next()
}

export const onRequest = sequence(validationRoute);