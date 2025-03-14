import { RoutePath } from '../../types'

/**
 * Type-safe helper function to cast route paths for navigation
 * @param path The route path to cast
 * @returns The path cast to its specific RoutePath enum value
 */
export function castRoutePath<T extends RoutePath>(path: T): T {
  return path
}
