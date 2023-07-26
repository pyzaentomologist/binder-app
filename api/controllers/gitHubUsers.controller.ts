import {connect} from 'mongoose'
import {UserGitHub, UserGitHubDocument} from '../models/userGitHub.model'
import {config} from '../config'

export async function createUser(name: string, gitHubUserId: number) {
  await connect(config.mongooseDatabase)
  const user = new UserGitHub({
    name,
    tokenVersion: 0,
    gitHubUserId: gitHubUserId.toString(),
  })
  try {
    await user.save()
    return user
  } catch (error) {
    throw new Error('Failed to save user to the database.')
  }
}

export async function getUserByGitHubId(gitHubUserId: number): Promise<UserGitHubDocument | null> {
  return UserGitHub.findOne({gitHubUserId: gitHubUserId.toString()})
}

export async function getUserById(id: string): Promise<UserGitHubDocument | null> {
  return UserGitHub.findOne({gitHubUserId: id.toString()})
}

export async function increaseTokenVersion(userId: string): Promise<UserGitHubDocument | null> {
  const result = await UserGitHub.findOneAndUpdate({id: userId}, {$inc: {tokenVersion: 1}})
  if (result) return result

  throw new Error()
}
