import _ from 'lodash'
import { useMemo } from 'react'
import { NavigateOptions, useLocation, useNavigate } from 'react-router'

import { RouteParams, RoutePath } from '@/types'

type NavigateProps<key extends keyof RouteParams> = key extends unknown
  ? undefined extends RouteParams[key]
    ?
        | [screen: key] // if the params are optional, we don't have to provide it
        | [
            screen: key,
            RouteParams[key],
            params?: {
              replace?: NavigateOptions['replace']
              preventScrollReset?: NavigateOptions['preventScrollReset']
            }
          ]
    : [
        screen: key,
        RouteParams[key],
        params?: {
          replace?: NavigateOptions['replace']
          preventScrollReset?: NavigateOptions['preventScrollReset']
        }
      ]
  : never

export const useAppNavigate = <RouteName extends keyof RouteParams>(): {
  navigate: <RouteName extends keyof RouteParams>(
    ...args: NavigateProps<RouteName>
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

  const navigate = <RouteName extends keyof RouteParams>(
    ...args: NavigateProps<RouteName>
  ): void => {
    const [path, params, rest] = args
    if (params) {
      const query = _.map(params as any, (v, k) => `${k}=${v}`).join('&')
      baseNavigate(`${path}?${query}`, rest)
    } else {
      baseNavigate(path, rest)
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
