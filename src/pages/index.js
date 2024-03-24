import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from './shared/Navbar';
import LoginForm from './loginAndSignup/Login';
import SignupForm from './loginAndSignup/Signup';
import { Container, Grid, Typography } from '@mui/material';
import axios from 'axios';

export default function Home() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [searchItem, setSearchItem] = useState('');
  const [searchData, setSearchData] = useState({});
  const [isSearchInvalid, setIsSearchInvalid] = useState(false);

  const handleSearch = async () => {
    if (!searchItem.trim()) {
      setIsSearchInvalid(true);
      return;
    }
    setIsSearchInvalid(false);
    const response = await axios.get(`/api/tmdb/multiSearch?searchItem=${encodeURIComponent(searchItem)}`);
    setSearchData(response.data);
    console.log('response: ', response.data);
  }

  return (
    <div>
      <Head>
        <title>FlickQueue</title>
        <meta name="description" content="Browse your favorite movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        searchItem={searchItem}
        setSearchItem={setSearchItem}
        handleSearch={handleSearch}
        isSearchInvalid={isSearchInvalid}
      />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Information Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to FlickQueue
            </Typography>
            <Typography variant="h5">
              Your ultimate movie and TV show tracking app.
            </Typography>
            {/* Additional content */}
          </Grid>
          
          {/* Form Column */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {isLoginView ? (
              <LoginForm setIsLoginView={setIsLoginView} />
            ) : (
              <SignupForm setIsLoginView={setIsLoginView} />
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
