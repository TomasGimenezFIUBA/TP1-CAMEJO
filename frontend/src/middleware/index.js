import { sequence } from "astro:middleware";

import { publicRoutes } from "../config/routes";

async function validationRoute (context, next) {
    const currentURL = new URL(context.request.url)
    
    if (!publicRoutes.includes(currentURL.pathname)){
        /*return new Response(null, {
            status: 302,
            headers: {
                Location: '/login'
            }
        });*/
    }

    return next()
}

export const onRequest = sequence(validationRoute);