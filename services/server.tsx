import { store } from '@/store'
import {PlayerStruct, UserStruct } from '@/utils/type.dt'
import axios from 'axios'
import { globalActions } from '@/store/globalSlices'
import { toast } from 'react-toastify'


const { setPlayers, setUser, setPlayer } = globalActions
const getPlayers = async (owner: string): Promise<PlayerStruct[]> => {
  try {
    const response = await axios.get(`http://127.0.0.1:4000/api/players/${owner}`)
    if (!response.data) {
      throw new Error('Failed to fetch Players')
    }
    const players = await response.data
    if (players.players.length === 0) {
      return []
    } else {
      console.log('yes')
      return structuredPlayers(players.players)
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

const getPlayer = async ( owner: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:4000/api/${owner}`)
    if (!response.data) {
      throw new Error('Failed to fetch Players')
    }
    const player = await response.data
    console.log(player)
    return structuredPlayer(player)
  } catch (error) {
    console.log(error)
  }
}

const getUser = async (owner: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:4000/api/${owner}`)
    console.log(response.status)
    store.dispatch(setUser(response.data))
    return structuredUser(response.data)
  } catch (error) {
    console.error(error)
  }
}



const updateUser = async (owner: string, newData: any) => {
  try {
    const response = await axios.put(`http://127.0.0.1:4000/api/lottery/update/${owner}`,
        newData
    )
    console.log(response.status)
    const user = await getUser(owner)
    store.dispatch(setUser(user))
  } catch (error) {
    console.log(error)
  }
}
const createUser = async (owner: string, name: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:4000/api/create', {
      name,
      owner,
      pointsEarned: 0,
      totalEarning: 0,
      currentBalance: 0,
    })
    const user = await response.data
    toast.success('User created')
    store.dispatch(setUser(user))
    return structuredUser(user);
  } catch (error) {
    console.log(error)
  }
}
const discord = async (owner: string) => {
  try {
    const response = await axios.get('http://127.0.0.1:4000/api/auth/discord/redirect', {
      owner
    }
    )
    const user = await response.data
    toast.success('User created')
    store.dispatch(setUser(user))
    return structuredUser(user);
  } catch (error) {
    console.log(error)
  }
}

const verifyTweet = async(tweetId: string, owner: string) => {
  try {
    const response = await axios.put(`http://127.0.0.1:4000/api//get/tweet/${tweetId}`, {
      owner
    }
    )
    const user = await response.data
    toast.success('User created')
    store.dispatch(setUser(user))
    return structuredUser(user);
  } catch (error) {
    console.log(error)
  }
}

const structuredPlayers = (players: PlayerStruct[]): PlayerStruct[] =>
  players.map((player) => ({
    name: player.name,
    email: player.email,
    owner: player.owner,
    pointsEarned: player.pointsEarned,
    totalEarning: player.totalEarning,
    currentBalance: player.currentBalance,
    discordJoined:player.discordJoined,
      twitterJoined:player.twitterJoined,
      repostedTweet:player.repostedTweet
  }))

const structuredPlayer = (player: PlayerStruct): PlayerStruct => ({
    name: player.name,
    email: player.email,
    owner: player.owner,
    pointsEarned: player.pointsEarned,
    totalEarning: player.totalEarning,
    currentBalance: player.currentBalance,
    discordJoined:player.discordJoined,
    twitterJoined:player.twitterJoined,
    repostedTweet:player.repostedTweet
})
const structuredUser = (user: UserStruct): UserStruct => ({
    name: user.name,
    email: user.email,
    owner: user.owner,
    pointsEarned: user.pointsEarned,
    totalEarning: user.totalEarning,
    currentBalance: user.currentBalance,
    discordJoined:user.discordJoined,
    twitterJoined:user.twitterJoined,
    repostedTweet:user.repostedTweet
})

export {
  getPlayers,
  getPlayer,
  getUser,
  createUser,
  verifyTweet,
  updateUser
}