import $request from '../request'

export const queryNoticeList = () => $request({ url: '/notice/list', method: 'GET' })
