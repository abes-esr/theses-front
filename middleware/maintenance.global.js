export default defineNuxtRouteMiddleware((to, from) => {
    const config = useRuntimeConfig();
    const isMaintenance = config.public.IS_MAINTENANCE;

    if (isMaintenance && to.path !== '/maintenance') {
        return navigateTo('/maintenance')
    }

    if (!isMaintenance && to.path === '/maintenance') {
        return navigateTo('/')
    }
})