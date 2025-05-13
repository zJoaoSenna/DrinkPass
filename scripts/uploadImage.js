// uploadImage.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises'; // For reading the file
import path from 'path';     // For handling file paths

// --- Configuration ---
// IMPORTANT: Replace with your actual Supabase URL and SERVICE_ROLE_KEY
// Using the service_role key bypasses RLS, use with caution and only in secure backend environments.
// For client-side or less trusted environments, you'd use the anon key and rely on RLS.
const SUPABASE_URL = 'https://rcenuwiztnzkclfyekgo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZW51d2l6dG56a2NsZnlla2dvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjY1NDU2OCwiZXhwIjoyMDYyMjMwNTY4fQ.dhzpLEpJRieqNiiYav2mWenOiq66lpIZmnC9IV8PFCQ'; // Or anon key if appropriate

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET_NAME = 'restaurantlogos';
// IMPORTANT: Update this path to where your image is actually saved
const IMAGE_FILE_PATH = 'C:/Users/ronal/Downloads/49574298_2265753966782187_6477282334201610240_o_7.jpg'; // Assumes the image is in the same directory as the script

async function uploadImage(filePath) {
  try {
    const fileName = path.basename(filePath);
    const fileBuffer = await fs.readFile(filePath);
    const fileExtension = path.extname(fileName).slice(1); // e.g., 'png'

    console.log(`Attempting to upload ${fileName} to bucket ${BUCKET_NAME}...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`public/${Date.now()}_${fileName}`, fileBuffer, {
        contentType: `image/${fileExtension}`, // Set content type based on file extension
        cacheControl: '3600',
        upsert: false, // Set to true if you want to overwrite if file with same name exists
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    console.log('Image uploaded successfully:', data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (publicUrlData) {
      console.log('Public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } else {
      console.warn('Could not get public URL, but upload might have succeeded.');
      return data.path; // Return the path if public URL isn't immediately available
    }

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return null;
  }
}

// --- Run the upload ---
(async () => {
  // Resolve the absolute path to the image
  const absoluteImageFilePath = path.resolve(IMAGE_FILE_PATH);
  console.log(`Looking for image at: ${absoluteImageFilePath}`);

  // Check if file exists
  try {
    await fs.access(absoluteImageFilePath);
  } catch (e) {
    console.error(`Error: Image file not found at ${absoluteImageFilePath}. Please check the IMAGE_FILE_PATH.`);
    return;
  }

  const uploadedUrl = await uploadImage(absoluteImageFilePath);
  if (uploadedUrl) {
    console.log(`\nUpload complete. Image URL (or path): ${uploadedUrl}`);
  } else {
    console.log('\nUpload failed.');
  }
})();