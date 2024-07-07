import { getUser } from '@/services/server';
import { RootState } from '@/utils/type.dt';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';

const Discord: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((states: RootState) => states.globalStates)

    const {address, isConnected} = useAccount();
    const clientID = '1259403805112406037';
    const backendRedirectURI = encodeURIComponent('http://localhost:4000/api/auth/discord/redirect');
    const owner = address;
    const frontendRedirectURI = encodeURIComponent('http://localhost:3000');
    const scopes = 'guilds identify gdm.join guilds.join email connections guilds.members.read';
    const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=${backendRedirectURI}&scope=${encodeURIComponent(scopes)}&state=${owner}:${frontendRedirectURI}`;
    


  useEffect(() => {
    if(address){
      getUser(address.toString())
    }
  }, [address, dispatch])
    return (
        <div className="text-blue-600 flex justify-between w-[100%]">
                <div>
                <h1>Join Our Discord to get 0.0001ETH</h1>
            </div>
            {
                
                user?.discordJoined === false && (
                    <div>
                    
                    <Link href={discordAuthURL} target='_blank'>
                    JOIN
                    </Link>
                </div>
                )
            }
        </div>
    );
};

export default Discord;
