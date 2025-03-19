// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', serialize('__session', '', {
    maxAge: -1,
    path: '/',
  }));
  res.status(200).json({ success: true });
}