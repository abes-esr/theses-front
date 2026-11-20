const AUTHORIZED_NB = [10, 25, 50];

export default defineNuxtRouteMiddleware((to) => {
  if (to.query.nb === undefined) return

  const values = Array.isArray(to.query.nb) ? to.query.nb : [to.query.nb]
  const raw = values[0]
  const n = Number.parseInt(String(raw), 10)
  const safe = Number.isNaN(n) || n < 1 ? undefined : clamp(n)
  clamp(n);

  const isClean = values.length === 1 && safe !== undefined && String(safe) === raw
  if (isClean) return

  const query = { ...to.query }
  if (safe === undefined) delete query.nb
  else query.nb = String(safe)

  return navigateTo({ path: to.path, query, hash: to.hash }, { replace: true })
})

function clamp(n) {
  if (AUTHORIZED_NB.includes(n)) return n;

  if (n > AUTHORIZED_NB[AUTHORIZED_NB.length - 1])
    return Math.min(n, AUTHORIZED_NB[AUTHORIZED_NB.length - 1]);

  if (n < AUTHORIZED_NB[0])
    return Math.max(n, AUTHORIZED_NB[0]);

  for (let i = AUTHORIZED_NB.length-2; i >= 0; i--) {
    if (AUTHORIZED_NB[i] < n) return AUTHORIZED_NB[i];
  }
}
