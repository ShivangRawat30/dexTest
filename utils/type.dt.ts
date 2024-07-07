export interface PlayerStruct {
  name: string
  email: string
  owner: string
  pointsEarned: number
  totalEarning: number
  currentBalance: number
  discordJoined:boolean
      twitterJoined:boolean
      repostedTweet:boolean
}


export interface UserStruct {
  name: string
  email: string
  owner: string
  pointsEarned: number
  totalEarning: number
  currentBalance: number
  discordJoined:boolean
  twitterJoined:boolean
  repostedTweet:boolean
}

export interface GlobalState {
  players: PlayerStruct[]
  player: PlayerStruct | null
  user: UserStruct | null 
}

export interface RootState {
  globalStates: GlobalState
}
