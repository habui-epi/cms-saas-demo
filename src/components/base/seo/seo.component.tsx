import Head from 'next/head';

interface SEOComponentProps {
  title?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
}

export const SEOComponent: React.FC<SEOComponentProps> = ({
  title,
  metaTitle,
  metaDescription,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const pageTitle = metaTitle || title || 'Optimizely CMS';
  const pageDescription = metaDescription || '';
  const pageOgTitle = ogTitle || pageTitle;
  const pageOgDescription = ogDescription || pageDescription;
  const pageTwitterTitle = twitterTitle || pageTitle;
  const pageTwitterDescription = twitterDescription || pageDescription;

  return (
    <Head>
      <title>{pageTitle}</title>
      {pageDescription && <meta name="description" content={pageDescription} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      <meta property="og:title" content={pageOgTitle} />
      {pageOgDescription && <meta property="og:description" content={pageOgDescription} />}
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTwitterTitle} />
      {pageTwitterDescription && <meta name="twitter:description" content={pageTwitterDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Head>
  );
};