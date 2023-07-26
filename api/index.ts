if (process.env.NODE_ENV !== 'prodction') {
  require('dotenv').config()
}
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import {getGitHubUser} from './github-adapter'
import {connectToDatabase} from './database'
import {getUserByGitHubId, createUser, getUserById} from './controllers/gitHubUsers.controller'
import {
  buildTokens,
  setTokens,
  verifyRefreshToken,
  refreshTokens,
  clearTokens,
} from './utils/token.util'
import {config} from './config'
import {Cookies} from '../shared'

const port = process.env.PORT || 3001

const app = express()

app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use(cookieParser())
app.get('/', (req, res) => res.send('api is healthy'))

app.get('/github', async (req, res) => {
  const {code} = req.query

  const gitHubUser = await getGitHubUser(code as string)
  let user = await getUserByGitHubId(gitHubUser.id)
  if (!user) user = await createUser(gitHubUser.login, gitHubUser.id)

  const {accessToken, refreshToken} = buildTokens(user)
  setTokens(res, accessToken, refreshToken)

  res.redirect(`${config.clientUrl}/me`)
})

app.get('/refresh', async (req, res) => {
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken])
    const user = await getUserById(current.userId)
    if (!user) throw 'User not found'
    const {accessToken, refreshToken} = refreshTokens(current, user.tokenVersion)
    setTokens(res, accessToken, refreshToken)
  } catch {
    clearTokens(res)
  }

  res.end()
})
app.get('/logout', async (req, res) => {})
app.get('/logout-all', async (req, res) => {})
app.get('/me', async (req, res) => {})

async function startServer() {
  await connectToDatabase()
  app.listen(port)
}
startServer()
