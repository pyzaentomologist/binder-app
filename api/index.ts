if (process.env.NODE_ENV !== 'prodction') {
  require('dotenv').config()
}
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import {getGitHubUser} from './github-adapter'
import {connectToDatabase} from './database'
import {
  getUserByGitHubId,
  createUser,
  getUserById,
  increaseTokenVersion,
} from './controllers/gitHubUsers.controller'
import {
  buildTokens,
  setTokens,
  verifyRefreshToken,
  refreshTokens,
  clearTokens,
} from './utils/token.util'
import {config} from './config'
import {Cookies} from '@shared'
import {authMiddleware} from './middleware/authMiddleware'

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
app.get('/logout', authMiddleware, async (req, res) => {
  clearTokens(res)
  res.end()
})
app.get('/logout-all', authMiddleware, async (req, res) => {
  await increaseTokenVersion(res.locals.token.userId)

  clearTokens(res)
  res.end()
})
app.get('/me', authMiddleware, async (req, res) => {
  const user = await getUserById(res.locals.token.userId)
  res.json(user)
})

async function startServer() {
  await connectToDatabase()
  app.listen(port)
}
startServer()
