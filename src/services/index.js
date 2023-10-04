import * as Model from '../models'
import { WrapperService } from './WrapperService'

export const MemberService = WrapperService(Model.MemberModel)
export const TokenService = WrapperService(Model.TokenModel)
