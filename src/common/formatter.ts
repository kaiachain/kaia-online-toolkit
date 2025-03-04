export const stringify = (data: any) => {
  return JSON.stringify(
    data,
    (_, x) => (typeof x === 'bigint' ? `BigInt(${x.toString()})` : x),
    2
  )
}

export const parseError = (error: any) => {
  const str = stringify(error)
  if (str && str !== '{}') {
    return str
  }
  if (error instanceof Error) {
    return stringify(error.message)
  }

  return 'Unknown error'
}
