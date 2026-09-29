import React from 'react';
import Link from 'next/link';
import { Link as MuiLink, Typography } from '@mui/material';
import LegalPage, { LEGAL_CONTACT_EMAIL, Section } from '../components/LegalPage';

const Privacy = () => (
    <LegalPage title="Privacy Policy" lastUpdated="September 28, 2026">
        <Typography>
            FlickQueue is a free movie and TV watchlist app operated by Timberfoot Tech LLC, a Nevada company
            (&quot;we&quot; or &quot;us&quot;). This policy explains what we collect, why, and the choices you have.
        </Typography>

        <Section heading="What we collect">
            <ul>
                <li>
                    <strong>Account details you give us:</strong> first and last name, email address, username, and
                    password. Passwords are stored only as a one-way hash, never in readable form.
                </li>
                <li>
                    <strong>What you save:</strong> your watchlists, the titles on them, and whether you marked them watched.
                </li>
                <li>
                    <strong>Your settings:</strong> your country for streaming availability, your adult content preference,
                    and the date you confirmed you are 18 or older if you turned that setting on.
                </li>
                <li>
                    <strong>Basic server logs:</strong> like most websites, our server records technical details such as IP
                    address, browser type, and pages requested. We use these only for security and troubleshooting, and
                    they are deleted on a rolling basis.
                </li>
            </ul>
            <Typography>We do not collect payment information.</Typography>
        </Section>

        <Section heading="What we don't do">
            <ul>
                <li>We don&apos;t show ads.</li>
                <li>We don&apos;t use analytics or tracking tools.</li>
                <li>We don&apos;t sell, rent, or share your personal information with anyone for marketing.</li>
            </ul>
        </Section>

        <Section heading="Cookies">
            <Typography>
                We use a single essential cookie to keep you logged in. It expires after 7 days or when you log out. We
                don&apos;t use advertising or tracking cookies.
            </Typography>
        </Section>

        <Section heading="Movie data and images">
            <Typography>
                Movie and TV information comes from The Movie Database (TMDB), and streaming availability comes from
                JustWatch through TMDB. Posters and other images load directly from TMDB&apos;s servers, so TMDB can see
                your IP address when your browser loads them. That is covered by{' '}
                <MuiLink href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer">
                    TMDB&apos;s privacy policy
                </MuiLink>
                . We never send your account details to TMDB or JustWatch.
            </Typography>
        </Section>

        <Section heading="How your data is stored">
            <Typography>
                Your data is stored on a server in the United States. All traffic uses HTTPS. We keep nightly backups
                of the database for up to 14 days so we can recover from mistakes or failures.
            </Typography>
        </Section>

        <Section heading="Your choices">
            <ul>
                <li>You can view and change your account details anytime on your Profile page.</li>
                <li>
                    You can delete your account from the Profile page. This immediately removes your account and all of
                    your watchlists. Copies in our backups are removed automatically within 14 days.
                </li>
                <li>
                    You can also email us to ask what we have about you or to request deletion.
                </li>
            </ul>
        </Section>

        <Section heading="Children">
            <Typography>
                FlickQueue is not intended for children under 13, and we don&apos;t knowingly collect information from
                them. If you believe a child under 13 has created an account, contact us and we will delete it. Adult
                content can only be turned on by users who confirm they are 18 or older.
            </Typography>
        </Section>

        <Section heading="Changes to this policy">
            <Typography>
                If we change this policy, we will update the date at the top of this page. Significant changes will
                also be noted in the app.
            </Typography>
        </Section>

        <Section heading="Contact">
            <Typography>
                Questions or requests: <MuiLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</MuiLink>.
                See also our{' '}
                <MuiLink component={Link} href="/terms">
                    Terms of Use
                </MuiLink>
                .
            </Typography>
        </Section>
    </LegalPage>
);

export default Privacy;