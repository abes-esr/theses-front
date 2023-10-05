export const useReferentielFetch = (request, opts) => {
  const config = useRuntimeConfig()
  return useFetch(request, { baseURL: config.public.API_REF, ...opts })
}