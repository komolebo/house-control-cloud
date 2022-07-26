import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');


@Injectable()
export class CloudinaryService {

    async uploadImage(
        file: Express.Multer.File, folder: string, profile_id: string | null
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        const options = profile_id ? {public_id: profile_id} : {folder: folder};

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }

    async removeImage ( public_id: string ) {
        return new Promise((resolve, reject) => {
            v2.uploader.destroy(public_id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
        })
    }
}
