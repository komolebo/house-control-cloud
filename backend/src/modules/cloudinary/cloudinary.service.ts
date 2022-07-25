import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');


@Injectable()
export class CloudinaryService {

    async uploadImage(
        file: Express.Multer.File, folder: string, profile_id: string | null
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        const options = profile_id
            ? {public_id: profile_id}
            : {folder: folder};

        console.log(options, profile_id)

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }
}