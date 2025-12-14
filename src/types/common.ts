export type IUser = {
  id: string
  username: string
  password: string
  email: string
  role: string
  status: string
  isDelete: boolean
  createAt: string
  updateAt: string
}

export type IEditUser = Omit<IUser, 'createAt' | 'updateAt'>

export type IPatient = Omit<IUser, 'role' | 'password'>

export type IUserLogin = {
  username: string
  password: string
}

export type IAppointment = {
  id: string
  patientId: string
  appointmentTime: string
  status: number // 0 待就诊 1 已完成 2 已取消
  createAt: string
  updateAt: string
}

export type IEditAppointment = Omit<IAppointment, 'createAt' | 'updateAt'>

export type IEditPatient = Omit<IPatient, 'createAt' | 'updateAt'>

export type IDashboard = {
  patientCount: number
  appointmentCount?: number // 预约数 仅在医生页面显示
  medicineCount: number
  doctorCount: number
  registrationCount?: number // 挂号数 仅在医生页面显示
}

export type IMedicine = {
  id: string
  name: string
  specification: string
  unit: string
  price: number
  stock: number
  createAt: string
  updateAt: string
  status: number // 0停售 1正常
}

export type IEditMedicine = Omit<IMedicine, 'createAt' | 'updateAt'>

// 挂号
export type IRegistration = {
  id: string
  patientId: string
  deptName: string
  doctorName: string
  regTime: string
  fee: number
  status: number // 0 已挂号 1 已完成 2 退号
  createAt: string
  updateAt: string
}

export type IEditRegistration = Omit<IRegistration, 'createAt' | 'updateAt'>

export type IStockResDto = {
  id: number
  uuid: string
  skuId: string
  count: number
  reserveCount: number
  name: string
  type: string
  status: string
  remark: string
  createAt: string
  updateAt: string
  isDelete: boolean
}

export type IOrderResDto = {
  id: number
  uuid: string
  userId: string
  amount: number
  name: string[]
  address: string
  skuId: string[]
  price: number
  totalPrice: number
  status: string
  isDelete: boolean
  createAt: string
  updateAt: string
}

export type IStockUpdateReqDto = {
  id: number
  count: number
  name?: string
  type?: string
  status?: string
  remark?: string
  reservedCount?: number
  skuId?: string
  price?: number
}

export type IUserUpdateReqDto = {
  id: number
  username: string
  password: string
  email: string
  role: string
}

export type IOrderUpdateReqDto = {
  userId: number
  amount: number
  name: string[]
  address: string
  skuId: string[]
  price: number
  totalPrice: number
  status: string
  orderId: number
}

export type IStockAddReqDto = {
  stockId: number
  count: number
}

export type InsertStockReqDto = {
  name: string
  type: string
  count: number
  status: string
  remark: string
  skuId: string
  reservedCount: number
  price: number
}

export type IOrderStatusUpdateReqDto = {
  orderId: string
  userId: string
}

export type orderItemReqDto = {
  skuId: string
  name: string
  quantity: number
}

export type IOrderCreateReqDto = {
  userId: number
  address: string
  items: orderItemReqDto[]
  status?: string
  orderId?: string
}

export type INoticeResDto = {
  id: number
  name: string
  status: string
  createAt: string
  content: string
  updateAt: string
  isDelete: boolean
}

export type IOrderStatistic = {
  turnover: number
  orderCount: number
  productCount: number
  orderGrowth: number
}

export type IResponse<T> = {
  code: number;
  data: T;
  message: string;
};
