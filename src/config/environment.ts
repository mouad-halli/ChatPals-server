import dotenv from 'dotenv'
dotenv.config()

const PORT: number = Number(process.env.PORT || 8000)

const DB_LINK: string = String(process.env.DB_LINK)

// Front end
const CLIENT_URL: string = String(process.env.FRONT_END_URL)

// Back end
const SERVER_URL: string = String(process.env.BACK_END_URL)

// TOKENS SECRET AND EXPIRATION DATE
const ACCESS_TOKEN_SECRET: string = String(process.env.ACCESS_TOKEN_SECRET)

const REFRESH_TOKEN_SECRET: string = String(process.env.REFRESH_TOKEN_SECRET)

const ACCESS_TOKEN_EXPIRATION: string = String(process.env.ACCESS_TOKEN_EXPIRATION)

const REFRESH_TOKEN_EXPIRATION: string = String(process.env.REFRESH_TOKEN_EXPIRATION)

export {
    PORT, DB_LINK, CLIENT_URL, SERVER_URL, 
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, 
    ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION
}