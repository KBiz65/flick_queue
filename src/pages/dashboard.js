import React from 'react';
import Head from 'next/head';
import pool from '@/lib/db';
import { getUserIdFromCookieHeader } from '@/lib/auth';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Dashboard = ({ firstName }) => {
  return (
    <>
      <Head>
        <title>Dashboard | FlickQueue</title>
      </Head>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="h6" component="h3">
            Welcome, {firstName}!
          </Typography>
          {/* Section 1 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">Section 1</Typography>
            {/* Content for Section 1 */}
          </Box>
          {/* Section 2 */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">Section 2</Typography>
            {/* Content for Section 2 */}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export async function getServerSideProps({ req }) {
  const loginRedirect = {
    redirect: {
      destination: '/?from=/dashboard',
      permanent: false,
    },
  };

  const userId = getUserIdFromCookieHeader(req.headers.cookie);
  if (!userId) return loginRedirect;

  const { rows } = await pool.query('SELECT first_name FROM users WHERE user_id = $1', [userId]);
  if (rows.length === 0) return loginRedirect;

  return {
    props: {
      firstName: rows[0].first_name,
    },
  };
}

export default Dashboard;