import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { isPromise } from './utils'
import createRouter from './router'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const router = createRouter()
const store = createPinia()

const app = createApp(App)
app.use(router).use(store)

router.beforeResolve((to, from, next) => {
  let diffed = false
  const matched = router.resolve(to).matched
  const prevMatched = router.resolve(from).matched

  if (from && !from.name)
    return next()

  const activated = matched.filter((c, i) => {
    return diffed || (diffed = prevMatched[i] !== c)
  })
  if (!activated.length)
    return next()

  const matchedComponents: any = []
  matched.forEach((route) => {
    matchedComponents.push(...Object.values(route.components))
  })
  const asyncDataFuncs = matchedComponents.map((component: any) => {
    const asyncData = component.asyncData || null
    if (asyncData) {
      const config = {
        store,
        route: to,
      }
      if (isPromise(asyncData) === false)
        return Promise.resolve(asyncData(config))

      return asyncData(config)
    }
    return null
  })
  try {
    Promise.all(asyncDataFuncs).then(() => {
      next()
    })
  }
  catch (err) {
    next(err as any)
  }
})

if (window.__INITIAL_STATE__)
  store.state.value = window.__INITIAL_STATE__

router.isReady().then(() => {
  app.mount('#app', true)
})
