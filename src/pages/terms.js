import React from 'react';
import Link from 'next/link';
import { Link as MuiLink, Typography } from '@mui/material';
import LegalPage, { LEGAL_CONTACT_EMAIL, Section } from '../components/LegalPage';

const Terms = () => (
    <LegalPage title="Terms of Use" lastUpdated="September 28, 2026">
        <Typography>
            These terms cover your use of FlickQueue, a free movie and TV watchlist app operated by Timberfoot Tech
            LLC (&quot;we&quot; or &quot;us&quot;). By creating an account or using the app, you agree to them.
        </Typography>

        <Section heading="Who can use FlickQueue">
            <Typography>
                You must be at least 13 years old to create an account. Adult content can only be turned on by users
                who are 18 or older.
            </Typography>
        </Section>

        <Section heading="Your account">
            <ul>
                <li>Give accurate information when you sign up, and keep your password private.</li>
                <li>You are responsible for activity on your account.</li>
                <li>Accounts are for one person and can&apos;t be shared or transferred.</li>
            </ul>
        </Section>

        <Section heading="Acceptable use">
            <Typography>Please don&apos;t:</Typography>
            <ul>
                <li>Scrape the app or access it with automated tools.</li>
                <li>Try to break, overload, or get around the app&apos;s security.</li>
                <li>Access other people&apos;s accounts or data.</li>
                <li>Use the app for anything illegal, or put offensive content in usernames or list names.</li>
            </ul>
        </Section>

        <Section heading="Movie data">
            <Typography>
                Movie and TV information comes from TMDB, and streaming availability comes from JustWatch. FlickQueue
                uses the TMDB API but is not endorsed or certified by TMDB. We can&apos;t guarantee this information is
                complete, accurate, or current, especially where a title is streaming.
            </Typography>
        </Section>

        <Section heading="A free service, provided as is">
            <Typography>
                FlickQueue is free and provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any
                kind. We may change, pause, or discontinue features or the whole app at any time, and while we back up
                data nightly, we can&apos;t promise it will never be lost.
            </Typography>
        </Section>

        <Section heading="Limitation of liability">
            <Typography>
                To the fullest extent allowed by law, Timberfoot Tech LLC is not liable for any indirect, incidental,
                or consequential damages, or for any loss of data, arising from your use of FlickQueue.
            </Typography>
        </Section>

        <Section heading="Ending your use">
            <Typography>
                You can delete your account anytime from your Profile page. We may suspend or delete accounts that
                break these terms.
            </Typography>
        </Section>

        <Section heading="Governing law">
            <Typography>These terms are governed by the laws of the State of Nevada.</Typography>
        </Section>

        <Section heading="Changes to these terms">
            <Typography>
                If we change these terms, we will update the date at the top of this page. Continuing to use FlickQueue
                after a change means you accept the updated terms.
            </Typography>
        </Section>

        <Section heading="Contact">
            <Typography>
                Questions: <MuiLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</MuiLink>. See also our{' '}
                <MuiLink component={Link} href="/privacy">
                    Privacy Policy
                </MuiLink>
                .
            </Typography>
        </Section>
    </LegalPage>
);

export default Terms;