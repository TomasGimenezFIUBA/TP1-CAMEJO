import { sequence } from "astro:middleware";

import { publicRoutes } from "../config/routes";

async function validationRoute ({request, locals}, next) {
    const currentURL = new URL(request.url)
    let isAuthenticated = request.headers.get('Cookie')?.includes('user_id')
    
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

    locals.userId = request.headers.get('Cookie').split('user_id=')[1].split(';')[0]
    next()
}

export const onRequest = sequence(validationRoute);