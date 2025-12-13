import { Router, RouteRecordNormalized } from 'vue-router'
import NProgress from 'nprogress'
import { isLogin } from '../utils'

const setPageGuard = (router: Router) => {
  router.beforeEach((to, from, next) => {
    if (to.meta?.title) {
      document.title = to.meta.title as string
    }

    // if user not login redirect to login page
    if (!isLogin() && to.path !== '/login') {
      next({ name: 'Login' })
      return
    }

    if (to.path === '/') {
      next({ name: 'IndexPage' })
      return
    }

    if (to.path === '/IndexPage') {
      next({ name: 'IndexPage' })
      return
    }

    NProgress.start()
    next()
  })

  router.afterEach((to, from) => {
    NProgress.done()
  })
}

export const getRoutes = () => {
  let routes = []
  if (routes.length === 0) {
    routes = import.meta.glob('./modules/**/*.{ts,tsx}', {
      eager: true,
    })
    routes = [...formatModules(routes, [])]
  }
  return routes
}

export const formatModules = (_modules: never, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

export const createRouteGuard = (router: Router) => {
  setPageGuard(router)
}
