import { IUser } from '../../types/common'
import { IUserResDto } from '../../utils/token'

// export type userStoreType = IUser & {
//   token: string
// }

export type userStoreType = IUserResDto;

export type userStoreState = {
  user: userStoreType | null
}
