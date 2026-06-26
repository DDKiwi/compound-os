import { useEffect, useState } from 'react'
import { navItems } from '../app/routes'
import { useAppStore } from '../stores/appStore'
import type { PageId } from '../types/investment'

const routeFromHash = (): PageId => {
  const route = window.location.hash.replace('#/', '')
  return navItems.some((item) => item.id === route) ? (route as PageId) : 'dashboard'
}

export function useHashRoute() {
  const [page, setPage] = useState<PageId>(routeFromHash)

  useEffect(() => {
    const syncRoute = () => setPage(routeFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  const navigate = (nextPage: PageId) => {
    window.location.hash = `/${nextPage}`
    setPage(nextPage)
    useAppStore.getState().setMobileOpen(false)
  }

  return { page, navigate }
}
