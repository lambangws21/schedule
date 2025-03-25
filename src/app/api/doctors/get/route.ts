// pages/api/doGet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec'; // Ganti dengan URL Web App Anda

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Mengambil data dari Google Apps Script Web App
      const response = await axios.get(GOOGLE_APPS_SCRIPT_URL);
      const data = response.data;

      if (data.error) {
        return res.status(400).json({ error: data.error });
      }

      return res.status(200).json(data); // Mengirimkan data yang diterima ke frontend
    } catch  {
      return res.status(500).json({ error: 'Failed to fetch data from Google Apps Script' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
