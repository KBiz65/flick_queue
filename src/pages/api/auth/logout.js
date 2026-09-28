import { createHandler } from '@/lib/api';
import { clearAuthCookie } from '@/lib/auth';

async function logout(req, res) {
    clearAuthCookie(res);
    res.status(200).json({ message: 'Logged out' });
}

export default createHandler({ POST: logout }, { auth: false });