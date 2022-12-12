import routes from 'virtual:generated-pages'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

export default function () {
  const routerHistory
    = import.meta.env.SSR === false
      ? createWebHistory(import.meta.env.BASE_URL)
      : createMemoryHistory(import.meta.env.BASE_URL)

  return createRouter({
    history: routerHistory,
    routes,
  })
}
