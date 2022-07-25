import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            cloud_name: 'homenet-kokopyka',
            api_key: '553615741828276',
            api_secret: 'kAN7s_yI29zigUN72rmEReKZiUI',
        });
    },
};