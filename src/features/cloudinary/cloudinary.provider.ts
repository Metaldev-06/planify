import { v2 as Cloudinary } from 'cloudinary';
import { env } from 'src/config/env';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  env;

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return Cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  },
};
