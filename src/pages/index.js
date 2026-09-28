import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { tmdbGet } from '@/lib/tmdb';

export default function Home({ slides, startIndex }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const router = useRouter();
    const { from } = router.query;

    return (
        <div>
            <Head>
                <title>FlickQueue</title>
                <meta name="description" content="Save movies and TV shows to watchlists, track what you've watched, and get recommendations." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <HeroCarousel slides={slides} startIndex={startIndex}>
                {isLoginView ? (
                    <LoginForm setIsLoginView={setIsLoginView} from={from} />
                ) : (
                    <SignupForm setIsLoginView={setIsLoginView} from={from} />
                )}
            </HeroCarousel>
        </div>
    );
}

function toSlide(item, type) {
    return {
        id: item.id,
        type,
        title: type === 'movie' ? item.title : item.name,
        year: ((type === 'movie' ? item.release_date : item.first_air_date) || '').slice(0, 4) || null,
        overview: item.overview || '',
        rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 0,
        backdropPath: item.backdrop_path,
    };
}

// This week's trending movies and shows, alternating, for the home page carousel
export async function getServerSideProps() {
    try {
        const [movies, shows] = await Promise.all([tmdbGet('/trending/movie/week'), tmdbGet('/trending/tv/week')]);
        const usable = (item) => item.backdrop_path && !item.adult;
        const movieSlides = movies.results.filter(usable).map((item) => toSlide(item, 'movie'));
        const showSlides = shows.results.filter(usable).map((item) => toSlide(item, 'tv'));

        const slides = [];
        for (let index = 0; index < Math.max(movieSlides.length, showSlides.length); index++) {
            if (movieSlides[index]) slides.push(movieSlides[index]);
            if (showSlides[index]) slides.push(showSlides[index]);
        }

        // Start on a random title so return visitors don't always see the same one first.
        // Picked on the server so the server and browser render the same slide.
        const startIndex = slides.length ? Math.floor(Math.random() * slides.length) : 0;

        return { props: { slides, startIndex } };
    } catch (error) {
        console.error('Failed to load trending titles for the home page:', error.message);
        return { props: { slides: [], startIndex: 0 } };
    }
}