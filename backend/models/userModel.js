const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  owner: {
    type: String,
  },
  pointsEarned: {
    type: Number,
  },
  totalEarning: {
    type: Number,
  },
  currentBalance: {
    type: Number,
  },

  discordJoined: {
    type: Boolean,
    default: false,
  },
  twitterJoined: {
    type: Boolean,
    default: false,
  },
  repostedTweet: {
    type: Boolean,
    default: false,
  },
})
userSchema.index({ owner: 1 }, { unique: true })

module.exports = mongoose.model('User', userSchema)
