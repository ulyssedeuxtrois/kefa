/**
 * upload-cloudinary.mjs
 * Upload une image locale vers Cloudinary et retourne l'URL publique
 */

import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs';

cloudinary.config({ cloud_url: process.env.CLOUDINARY_URL });

export async function uploadImage(localPath, publicId) {
  const result = await cloudinary.uploader.upload(localPath, {
    folder: 'kefa/rs',
    public_id: publicId,
    overwrite: true,
    resource_type: 'image'
  });

  // Nettoyage du fichier temp
  try { unlinkSync(localPath); } catch {}

  return result.secure_url;
}
