// 抛出 http 异常
export const HttpError = (message, code) => {
  const error = new Error(message)
  error.name = 'HttpError'
  if (code != null) {
    error.code = code
  }

  return Promise.reject(error)
}
