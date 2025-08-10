/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { config as dotenvConfig } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { BufferedFile } from '../interfaces';

dotenvConfig({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
}

export class FileManagerService {
  async uploadFile(
    file: BufferedFile,
  ): Promise<{ public_id: string; url: string }> {
    const resourceType = file.mimetype.startsWith('video') ? 'video' : 'image';

    const uploadResult: CloudinaryResult = await new Promise<CloudinaryResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              folder: 'ingredients', // optional: keep uploads organized
              public_id: undefined, // let Cloudinary auto-generate or set manually
              unique_filename: true,
            },
            (error, result: any) => {
              if (error) return reject(error as Error);
              resolve(result);
            },
          )
          .end(file.buffer);
      },
    );

    return {
      public_id: `${uploadResult?.public_id}`,
      url: uploadResult.secure_url,
    };
  }
}
