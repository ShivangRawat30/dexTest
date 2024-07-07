import { useState } from 'react';
import { getUser, verifyTweet } from '@/services/server';
import { RootState } from '@/utils/type.dt';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';

const Twitter: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.globalStates);
  const { address, isConnected } = useAccount();
  const tweetText = "Hello there I am here to support Shivang Rawat";
  const encodedText = encodeURIComponent(tweetText);
  const tweetIntentURL = `https://x.com/intent/tweet?text=${encodedText}`;

  // State to manage input visibility and tweet URL
  const [showInput, setShowInput] = useState(false);
  const [tweetUrl, setTweetUrl] = useState('');

  useEffect(() => {
    if (address) {
      getUser(address.toString());
    }
  }, [address, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweetUrl(e.target.value);
  };

  const handleVerifyClick = async () => {
    if (tweetUrl) {
      // Extract tweet ID from URL
      const tweetId = extractTweetIdFromUrl(tweetUrl);
      
      if (tweetId && address) {
         await verifyTweet(tweetId, address?.toString())
      } else {
        alert('Invalid tweet URL.');
      }
    } else {
      alert('Please enter a tweet URL.');
    }
  };

//   const getTweet =async () => {
//     const twitterClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAEfjugEAAAAAbuBH6nUDs5Pzkl4PCtPloUTacHI%3D3ZkaWQvnMdwOY87FEa3JIBdFQIOMmQAREHxaOaJlWIkEcNudkG');

// // Tell typescript it's a readonly app
// const readOnlyClient = twitterClient.readOnly;

// // Play with the built in methods
// const tweetId = extractTweetIdFromUrl(tweetUrl);
// const data = await readOnlyClient.v2.singleTweet(tweetId);

// console.log(data);
//   }
  const clientId = 'MlhlS0pheVYyX2dLcjFVQngxMzk6MTpjaQ'; // Replace with your actual client ID
  const redirectUri = encodeURIComponent('http://localhost:4000/callback'); // Replace with your actual redirect URI
  const scopes = encodeURIComponent('tweet.read tweet.write users.read offline.access');
  const state = address?.toString(); // Use address as the state value
  const twitterAuthURL = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;

  const extractTweetIdFromUrl = (url: string): string | null => {
    const match = url.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <header className="shadow-sm shadow-blue-900 py-4 text-blue-700">
      <main className="lg:w-2/3 w-full mx-auto flex justify-between items-center flex-wrap">
        <div className="flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
          <h1>Make Tweet and Earn 0.0001ETH</h1>
          {user?.repostedTweet === false && (
            <>
              <Link href={tweetIntentURL} target="_blank" rel="noopener noreferrer">Tweet</Link>
              <button onClick={() => setShowInput(!showInput)}>
                {showInput ? 'Cancel' : 'Verify Tweet'}
              </button>
              {showInput && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter tweet URL"
                    value={tweetUrl}
                    onChange={handleInputChange}
                    className="border p-2 mt-2"
                  />
                  <Link href={twitterAuthURL}>Authorize</Link>
                  <button onClick={handleVerifyClick} className="ml-2 bg-blue-500 text-white p-2">
                    Verify
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </header>
  );
};

export default Twitter;