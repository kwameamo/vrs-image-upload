// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Tell Next.js not to parse the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create a new form parser
  const form = new IncomingForm();
  
  // Parse the incoming form
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form' });
    }

    try {
      // Get the uploaded file and metadata
      const file = files.file[0];
      const { stationId, chassisId } = fields;
      
      // Validate required fields
      if (!stationId || !chassisId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.filepath, {
        // Organize files by station and chassis ID
        public_id: `${stationId}/${chassisId}/${Date.now()}`,
        folder: 'vrs_uploads'
      });

      // Return the secure URL and public ID
      return res.status(200).json({ 
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
}