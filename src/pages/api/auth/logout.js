import { clearAuthCookie } from '@/lib/auth';

export default function logout(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    clearAuthCookie(res);

    res.status(200).json({ message: 'Logged out' });
}