export default defineNuxtRouteMiddleware((to, from) => {
    const config = useRuntimeConfig();
    const isMaintenance = config.public.IS_MAINTENANCE;

    console.log(isMaintenance)

    if (isMaintenance && to.path !== '/maintenance') {
        return navigateTo('/maintenance')
    }
})