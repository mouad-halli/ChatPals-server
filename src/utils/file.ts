import { readdirSync, unlinkSync } from "fs"
import { UPLOAD_LOCATION } from "../config/environment"

export const deleteFileIfExist = (filePath: string) => {

    const fileToDelete = filePath.split('.')[0]
    
    readdirSync(UPLOAD_LOCATION)
    .forEach((file: string) => {

        const fileName = file.split('.')[0]
        
        if ( fileName === fileToDelete )
            unlinkSync(`${UPLOAD_LOCATION}/${file}`)
    })

}