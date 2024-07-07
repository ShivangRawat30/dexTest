
import { createUser, getUser } from '@/services/server'
import { globalActions } from '@/store/globalSlices'
import { RootState } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from 'wagmi'
import { signIn } from "next-auth/react";
import Link from 'next/link'
import Twitter from '@/components/Twitter'
import Discord from '@/components/Discord'

const Page: NextPage<{}> = ({}) => {
  const dispatch = useDispatch()
  const { setUser } = globalActions
  const { user } = useSelector((states: RootState) => states.globalStates)
  const {address, isConnected} = useAccount();
  const [userName, setUserName] = useState('')
  user

  useEffect(() => {
    if(address){
      getUser(address.toString())
    }
  }, [address, dispatch])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await createUser(address.toString(), userName.toString());
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Head>
        <title>DEX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isConnected ? (
        user?.owner !== address?.toString() ? (
          <div className="h-screen w-full flex flex-col items-center justify-center text-4xl gap-10 text-blue-600">
            <h1 className=" pb-5">Register User</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className=" flex flex-col pb-5">
                Enter Name:
                <input
                  type="text"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  required
                  className="text-black"
                />
              </label>
              <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded">
                Register
              </button>
            </form>


          </div>
        ) : (
          <div className="text-blue-600 w-full h-screen flex items-center justify-center flex-col gap-10">
            <h1 className="text-7xl">Get your Reward</h1>
            <h1 className="text-5xl">{user?.name}</h1>
            <div className='text-3xl w-[100%] h-[100%]gap-4 flex items-center flex-col' >
              <div className='border-2 border-blue-600 text-blue-600 flex items-center justify-between w-[50%] p-5'>

              {
                user?.discordJoined === false ? (
                  <Discord />
                ):(
                  <>
                  <Discord />
                  <h1 className='border-2 p-2 border-blue-600'>Done</h1>
                  </>
                )
              }
                </div>
              {
                user?.repostedTweet === false ? (
                  <Twitter />
                ):(
                  <>
                  <Twitter />
                  <h1>Done</h1>
                  </>
                )
              }
            </div>
            <div className='flex w-full flex-col gap-6 h-[25%] items-center justify-center'>
              <div className='gap-2'>
                <h1 className='text-5xl'>User data</h1>
                </div>
                <div className='flex gap-6 text-2xl'>
                  <h1>Total Points: {user?.pointsEarned}</h1>
                  <h1>Total Earned: {user?.totalEarning}</h1>
                  <h1>Current Balance: {user?.currentBalance}</h1>
              </div>
            </div>

          </div>
        )
      ) : (
        <div className=' w-full h-screen flex items-center justify-center flex-col text-5xl text-blue-600'>
          <h1 className="">Please connect your wallet</h1>
        </div>
      )}
      
    </div>
  )
}
export default Page
