export const config = {
  isProduction: process.env.NODE_ENV! === 'production',
  clientUrl: process.env.CLIENT_URL!,
  baseDomain: process.env.BASE_DOMAIN!,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,

  gitHubClientId: process.env.GITHUB_CLIENT_ID!,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET!,

  mongooseDatabase: process.env.DATABASE_URL!,
}
