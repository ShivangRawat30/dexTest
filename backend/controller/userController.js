const User = require('../models/userModel')
const url = require('url')
const axios = require('axios')
const TwitterApi = require('twitter-api-v2')
const cheerio = require('cheerio')

const userController = {}

userController.createUser = async (req, res) => {
  try {
    const { name, email, owner, pointsEarned, totalEarning, currentBalance } = req.body

    const newUser = new User({
      name,
      owner,
      pointsEarned,
      totalEarning,
      currentBalance,
    })

    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating user' })
  }
}

userController.getUser = async (req, res) => {
  try {
    const { owner } = req.params

    const user = await User.findOne({ owner: owner })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating user' })
  }
}

userController.updateUser = async (req, res) => {
  try {
    const { owner } = req.params

    const user = await User.findOneAndUpdate(
      { owner: owner },
      {
        name,
        pointsEarned,
        totalEarning,
        currentBalance,
        discordJoined,
        twitterJoined,
        repostedTweet,
      },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User Data updated successfully', user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating user' })
  }
}

userController.discordJoin = async (req, res) => {
  const { code, state } = req.query
  const [owner, frontendRedirectURI] = decodeURIComponent(state).split(':')
  console.log(frontendRedirectURI)

  if (code) {
    const formData = new url.URLSearchParams({
      client_id: process.env.ClientID,
      client_secret: process.env.ClientSecret,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: 'http://localhost:4000/api/auth/discord/redirect',
    })

    try {
      const output = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (output.data) {
        const access = output.data.access_token

        const userinfo = await axios.get('https://discord.com/api/v10/users/@me', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        })

        // Check if the access token is valid
        if (!userinfo.data) {
          throw new Error('Invalid access token')
        }

        const formData1 = new url.URLSearchParams({
          client_id: process.env.ClientID,
          client_secret: process.env.ClientSecret,
          grant_type: 'refresh_token',
          refresh_token: output.data.refresh_token,
        })

        const refresh = await axios.post('https://discord.com/api/v10/oauth2/token', formData1, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })

        // Join the guild
        const guildId = process.env.GuildID // Your guild ID
        const botToken = process.env.token // Your bot token

        try {
          console.log(`Attempting to join guild with ID: ${guildId}`)
          const joinGuild = await axios.put(
            `https://discord.com/api/v10/guilds/${guildId}/members/${userinfo.data.id}`,
            {
              access_token: refresh.data.access_token,
            },
            {
              headers: {
                Authorization: `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
            }
          )

          console.log('joinGuild response:', joinGuild.data)

          if (joinGuild.status === 201 || joinGuild.status === 204) {
            // Verify membership
            const verifyMember = await axios.get(
              `https://discord.com/api/v10/guilds/${guildId}/members/${userinfo.data.id}`,
              {
                headers: {
                  Authorization: `Bot ${botToken}`,
                },
              }
            )

            console.log('verifyMember response:', verifyMember.data)

            if (verifyMember.status === 200) {
              console.log(state)
              const user = await User.findOne({ owner: owner });
              if (!user) {
                return res.status(404).send('User not found');
              }
              const updatedPointsEarned = user.pointsEarned + 10
              const updatedTotalEarning = (user.totalEarning || 0) + 2990 * 0.001
              const updatedCurrentBalance = (user.currentBalance || 0) + 0.001
              const userUpdated = await User.findOneAndUpdate(
                { owner: owner },
                {
                  pointsEarned: updatedPointsEarned,
                  totalEarning: updatedTotalEarning,
                  currentBalance: updatedCurrentBalance,
                  discordJoined: true,
                },
                { new: true }
              )
              res.redirect(`http://localhost:3000`)
            } else {
              res.status(500).json({ error: 'Failed to verify guild membership' })
            }
          } else {
            res.status(500).json({ error: 'Failed to join guild' })
          }
        } catch (joinError) {
          console.error(
            'Error joining guild:',
            joinError.response ? joinError.response.data : joinError.message
          )
          res.status(500).json({ error: 'Failed to join guild hllo' })
        }

        console.log(output.data, userinfo.data, refresh.data)
      }
    } catch (error) {
      console.error(
        'Error fetching data from Discord:',
        error.response ? error.response.data : error.message
      )
      res.status(500).json({ error: 'Failed to fetch data from Discord' })
    }
  } else {
    res.status(400).json({ error: 'Missing authorization code' })
  }
}

userController.verifyTweet = async (req, res) => {
  const BEARER_TOKEN = process.env.BEARER_TOKEN
  console.log(BEARER_TOKEN)
  console.log(req.url)
  const { tweetId } = req.params
  const { owner } = req.body
  try {
    const twitterClient = new TwitterApi(BEARER_TOKEN)
    const readOnlyClient = twitterClient.readOnly

    const data = await readOnlyClient.v2.singleTweet(tweetId)
    console.log(data)
  } catch (error) {
    console.error(
      'Error fetching tweet data:',
      error.response ? error.response.data : error.message
    )
  }
}

userController.authorizeTweet = async (req, res) => {
  const { code } = req.query

  const tokenData = {
    code,
    grant_type: 'authorization_code',
    client_id: process.env.X_CLIENT_ID,
    client_secret: process.env.X_CLIENT_SECRET,
    redirect_uri: 'http://localhost:4000/callback',
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', tokenData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const { access_token, refresh_token } = tokenResponse.data

    // Use the access token to post a tweet
    const tweetText = 'Hello there I am here to support Shivang Rawat'
    const tweetResponse = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text: tweetText },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    )

    res.json({ message: 'Tweet posted successfully', tweet: tweetResponse.data })
  } catch (error) {
    console.error(
      'Error during Twitter OAuth:',
      error.response ? error.response.data : error.message
    )
    res.status(500).json({ error: 'Failed to authenticate with Twitter' })
  }
}

module.exports = userController
