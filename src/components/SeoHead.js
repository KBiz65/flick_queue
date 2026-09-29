import Head from 'next/head';
import { SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, absoluteUrl, truncate } from '@/lib/site';

// Page title, description, and link preview tags. Omit path on private pages (no canonical or og:url).
const SeoHead = ({ title, description, path, image, imageAlt, type = 'website', card = 'summary_large_image' }) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}: Discover, Track, Watch`;
    const desc = truncate(description) || DEFAULT_DESCRIPTION;
    const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);
    const alt = image ? imageAlt || title : 'FlickQueue logo';

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} key="description" />
            {path && <link rel="canonical" href={absoluteUrl(path)} key="canonical" />}
            <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
            <meta property="og:type" content={type} key="og:type" />
            <meta property="og:title" content={fullTitle} key="og:title" />
            <meta property="og:description" content={desc} key="og:description" />
            {path && <meta property="og:url" content={absoluteUrl(path)} key="og:url" />}
            <meta property="og:image" content={imageUrl} key="og:image" />
            <meta property="og:image:alt" content={alt} key="og:image:alt" />
            <meta name="twitter:card" content={card} key="twitter:card" />
            <meta name="twitter:title" content={fullTitle} key="twitter:title" />
            <meta name="twitter:description" content={desc} key="twitter:description" />
            <meta name="twitter:image" content={imageUrl} key="twitter:image" />
            <meta name="twitter:image:alt" content={alt} key="twitter:image:alt" />
        </Head>
    );
};

export default SeoHead;