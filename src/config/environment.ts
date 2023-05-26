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

//upload location
const UPLOAD_LOCATION: string = String(process.env.UPLOAD_LOCATION)

//google oauth
const GOOGLE_CLIENT_ID: string = String(process.env.GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET: string = String(process.env.GOOGLE_CLIENT_SECRET)

export {
    PORT, DB_LINK, CLIENT_URL, SERVER_URL, 
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, 
    ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION,
    UPLOAD_LOCATION, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID
}