import { diskStorage } from 'multer'
import { existsSync, mkdirSync } from 'fs'
import { extname } from 'path'
import { createError } from '../utils/error';
import { UPLOAD_LOCATION } from './environment';
import { deleteFileIfExist } from '../utils/file';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const multerOptions = {
    // file size limits
    // limits: {
    //     fileSize: +process.env.MAX_FILE_SIZE,
    // },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {

        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true)
        } else {
            // Reject file
            cb(createError(400, `Unsupported file type ${extname(file.originalname)}`), false)
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: DestinationCallback) => {
            // Create folder if doesn't exist
            if (!existsSync(UPLOAD_LOCATION)) {
                mkdirSync(UPLOAD_LOCATION)
            }
            cb(null, UPLOAD_LOCATION)
        },
        // File modification details
        filename: (req: any, file: any, cb: FileNameCallback) => {
            let uploadedFile: string = `${req.user._id}${extname(file.originalname)}`

            deleteFileIfExist(uploadedFile)
            
            cb(null, uploadedFile)
        }
    })
}