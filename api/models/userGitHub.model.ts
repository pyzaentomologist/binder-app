import {Schema, model} from 'mongoose'

interface UserGitHubDocument {
  _id: string
  name: string
  tokenVersion: number
  gitHubUserId: string
}

const userSchema = new Schema<UserGitHubDocument>({
  name: {
    type: String,
    required: true,
  },
  tokenVersion: {
    type: Number,
    required: true,
  },
  gitHubUserId: {
    type: String,
    required: true,
  },
})

const UserGitHub = model<UserGitHubDocument>('UserGitHub', userSchema)
export {UserGitHub, UserGitHubDocument}
