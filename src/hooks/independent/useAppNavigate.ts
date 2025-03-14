import _ from 'lodash'
import { useMemo } from 'react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router'

import { RouteParams, RoutePath } from '@/types'

export const useAppNavigate = <RouteName extends keyof RouteParams>(): {
  navigate: (
    path: RoutePath,
    params?: any,
    options?: {
      replace?: NavigateOptions['replace']
      preventScrollReset?: NavigateOptions['preventScrollReset']
      state?: any
    }
  ) => void
  params?: RouteParams[RouteName]
  goBack: () => void
  reload: () => void
} => {
  const { search } = useLocation()
  const params = useMemo<RouteParams[RouteName]>(() => {
    const searchParams = new URLSearchParams(search)
    const params = Object.fromEntries(searchParams.entries())
    return params as any
  }, [search])

  const baseNavigate = useNavigate()

  const navigate = (
    path: RoutePath,
    params?: any,
    options?: {
      replace?: NavigateOptions['replace']
      preventScrollReset?: NavigateOptions['preventScrollReset']
      state?: any
    }
  ): void => {
    if (params) {
      const query = _.map(params as any, (v, k) => `${k}=${v}`).join('&')
      baseNavigate(`${path}?${query}`, options)
    } else {
      baseNavigate(path, options)
    }
  }

  const goBack = (): void => {
    if (window?.history?.length > 1) {
      baseNavigate(-1)
    } else {
      navigate(RoutePath.Home, undefined, {})
    }
  }

  const reload = (): void => {
    window.location.reload()
  }

  return {
    navigate,
    params,
    goBack,
    reload,
  }
}
