import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://divingvisioncenter.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/__dev/*', '/admin/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
