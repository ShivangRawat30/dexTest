import { GlobalState, PlayerStruct, UserStruct } from '@/utils/type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {

  setPlayers: (state: GlobalState, action: PayloadAction<PlayerStruct[]>) => {
    state.players = action.payload
  },
  setPlayer: (state: GlobalState, action: PayloadAction<PlayerStruct | null>) => {
    state.player = action.payload
  },
  setUser: (state: GlobalState, action: PayloadAction<UserStruct | null>) => {
    state.user = action.payload
  },
}
