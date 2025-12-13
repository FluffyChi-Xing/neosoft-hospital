
// export type userStoreType = IUser & {
//   token: string
// }

import type { IUserResDto } from '@/utils/token.ts'

export type userStoreType = IUserResDto

export type userStoreState = {
  user: userStoreType | null
}
