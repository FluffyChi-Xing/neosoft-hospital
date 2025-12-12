import useStorage from '../hook/storage'

export interface IUserResDto {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  status: string;
  isDelete: boolean;
  createAt: string;
  updateAt: string;
  token: string;
}

export const getToken = () => {
  const { get } = useStorage('local');
  const userInfo = get('userInfo');
  const { token } = userInfo || {};
  return token || '';
}


export const setUserInfo = (params: IUserResDto) => {
  const { set } = useStorage('local');
  set('userInfo', params);
};


export const setToken = (token: string) => {
  const { set } = useStorage('local');
  set('token', token);
};


export const clearUserInfo = () => {
  const { remove } = useStorage('local');
  remove('userInfo');
}
