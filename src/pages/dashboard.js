import React from 'react';
import SeoHead from '../components/SeoHead';
import Link from 'next/link';
import pool from '@/lib/db';
import { tmdbGet, getViewerSettings, toMediaCard } from '@/lib/tmdb';
import { getWatchlistSummaries } from '@/lib/watchlists';
import Navbar from '../components/Navbar';
import MediaRow from '../components/MediaRow';
import WatchlistCard from '../components/WatchlistCard';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Section = ({ title, action, children }) => (
  <Box component="section" sx={{ mt: 6 }}>
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {action}
    </Box>
    {children}
  </Box>
);

const Dashboard = ({ firstName, watchlists, recommendations, trendingMovies, trendingTV }) => {
  return (
    <>
      <SeoHead title="Dashboard" />
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Typography variant="h2" component="h1">
          Welcome back, {firstName}
        </Typography>

        <Section
          title="Your watchlists"
          action={
            <Button component={Link} href="/watchlists" size="small">
              Manage lists
            </Button>
          }
        >
          {watchlists.length === 0 ? (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Tap + on any poster to start your first watchlist.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {watchlists.map((watchlist) => (
                <WatchlistCard key={watchlist.id} watchlist={watchlist} />
              ))}
            </Box>
          )}
        </Section>

        {/* Recommended for You (only once the user has saved titles) */}
        {recommendations.length > 0 && (
          <Section title="Recommended for you">
            <MediaRow mediaArray={recommendations} emptyMessage="" />
          </Section>
        )}

        <Section title="Trending movies this week">
          <MediaRow
            mediaArray={trendingMovies}
            mediaType="movie"
            emptyMessage="Trending movies aren't available right now. Try again in a few minutes."
          />
        </Section>

        <Section title="Trending TV shows this week">
          <MediaRow
            mediaArray={trendingTV}
            mediaType="tv"
            emptyMessage="Trending TV shows aren't available right now. Try again in a few minutes."
          />
        </Section>
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

// Build recommendations from the user's 5 most recently saved titles, skipping anything already saved
async function getRecommendations(userId, includeAdult) {
  const { rows: saved } = await pool.query(
    `SELECT m.tmdb_id, m.type, MAX(wi.added_at) AS last_added
    FROM watchlistitems wi
    JOIN watchlists w ON w.watchlist_id = wi.watchlist_id
    JOIN media m ON m.media_id = wi.media_id
    WHERE w.user_id = $1
    GROUP BY m.tmdb_id, m.type
    ORDER BY last_added DESC`,
    [userId]
  );

  if (saved.length === 0) return [];

  const perTitle = await Promise.all(
    saved.slice(0, 5).map(async (seed) => {
      try {
        const data = await tmdbGet(`/${seed.type}/${seed.tmdb_id}/recommendations`);
        return data.results
          .filter((item) => includeAdult || !item.adult)
          .map((item) => toMediaCard(item, seed.type));
      } catch (error) {
        console.error(`Failed to load recommendations for ${seed.type} ${seed.tmdb_id}:`, error.message);
        return [];
      }
    })
  );

  // Take one from each saved title's list in turn, so every saved title shapes the row
  const seen = new Set(saved.map((row) => `${row.type}-${row.tmdb_id}`));
  const recommendations = [];
  const longest = Math.max(...perTitle.map((list) => list.length));

  for (let index = 0; index < longest && recommendations.length < 20; index++) {
    for (const list of perTitle) {
      const item = list[index];
      if (!item) continue;
      const key = `${item.media_type}-${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      recommendations.push(item);
    }
  }

  return recommendations.slice(0, 20);
}

export async function getServerSideProps({ req }) {
  const loginRedirect = {
    redirect: {
      destination: '/?from=/dashboard',
      permanent: false,
    },
  };

  const { userId, includeAdult } = await getViewerSettings(req.headers.cookie);
  if (!userId) return loginRedirect;

  const { rows } = await pool.query('SELECT first_name FROM users WHERE user_id = $1', [userId]);
  if (rows.length === 0) return loginRedirect;

  // Load everything at the same time
  const [watchlists, recommendations, trendingMovies, trendingTV] = await Promise.all([
    getWatchlistSummaries(userId),
    getRecommendations(userId, includeAdult),
    getTrending('movie', includeAdult),
    getTrending('tv', includeAdult),
  ]);

  return {
    props: {
      firstName: rows[0].first_name,
      watchlists,
      recommendations,
      trendingMovies,
      trendingTV,
    },
  };
}

export default Dashboard;