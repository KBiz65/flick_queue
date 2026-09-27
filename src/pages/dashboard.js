import React from 'react';
import Head from 'next/head';
import pool from '@/lib/db';
import { getUserIdFromCookieHeader } from '@/lib/auth';
import { tmdbGet, allowsAdultContent, toMediaCard } from '@/lib/tmdb';
import Navbar from '../components/Navbar';
import MediaRow from '../components/MediaRow';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Dashboard = ({ firstName, trendingMovies, trendingTV }) => {
  return (
    <>
      <Head>
        <title>Dashboard | FlickQueue</title>
      </Head>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" component="h3">
          Welcome, {firstName}!
        </Typography>

        {/* Trending Movies */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Trending Movies This Week
          </Typography>
          <MediaRow
            mediaArray={trendingMovies}
            mediaType="movie"
            emptyMessage="Trending movies are unavailable right now. Please try again later."
          />
        </Box>

        {/* Trending TV Shows */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Trending TV Shows This Week
          </Typography>
          <MediaRow
            mediaArray={trendingTV}
            mediaType="tv"
            emptyMessage="Trending TV shows are unavailable right now. Please try again later."
          />
        </Box>
      </Container>
    </>
  );
};

// Load one trending list; if TMDB is down, show an empty row instead of breaking the dashboard
async function getTrending(type, includeAdult) {
  try {
    const data = await tmdbGet(`/trending/${type}/week`);
    return data.results
      .filter((item) => includeAdult || !item.adult)
      .map((item) => toMediaCard(item, type));
  } catch (error) {
    console.error(`Failed to load trending ${type}:`, error.message);
    return [];
  }
}

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

  const includeAdult = await allowsAdultContent(req.headers.cookie);

  // Fetch both lists at the same time
  const [trendingMovies, trendingTV] = await Promise.all([
    getTrending('movie', includeAdult),
    getTrending('tv', includeAdult),
  ]);

  return {
    props: {
      firstName: rows[0].first_name,
      trendingMovies,
      trendingTV,
    },
  };
}

export default Dashboard;