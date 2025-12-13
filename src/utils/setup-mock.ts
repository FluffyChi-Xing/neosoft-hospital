export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && import.meta.env.DEV) setup()
}

export const successResponseWrap = (data: unknown) => {
  return {
    data,
    status: 200,
    message: '请求成功',
  }
}

export const failResponseWrap = (data: unknown, msg: string, code = 50000) => {
  return {
    status: code,
    message: msg,
    data,
  }
}
