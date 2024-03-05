import Link from 'next/link';
import Head from 'next/head';
import React from 'react';

export default function Home() {
  return (
    <div>
      <Head>
        <title>FlickQueue</title>
        <meta name="description" content="Browse your favorite movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to FlickQueue</h1>
        <p>Find your favorite movies and TV shows at any time, anywhere.</p>
        
        {/* Example Navigation Link */}
        <Link href="/login" legacyBehavior>
          <a>Login</a>
        </Link>
        <Link href="/signup" legacyBehavior>
          <a>Sign Up</a>
        </Link>
      </main>
    </div>
  );
}
