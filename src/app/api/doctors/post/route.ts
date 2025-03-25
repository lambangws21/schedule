// pages/api/doPost.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec'; // Ganti dengan URL Web App Anda

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, profile, base64Image } = req.body;

    if (!name || !profile || !base64Image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Mengirim data ke Google Apps Script Web App
      const response = await axios.post(GOOGLE_APPS_SCRIPT_URL, {
        name,
        profile,
        base64Image,
      });

      if (response.data.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ error: 'Failed to add doctor data' });
      }
    } catch  {
      return res.status(500).json({ error: 'Failed to send data to Google Apps Script' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
