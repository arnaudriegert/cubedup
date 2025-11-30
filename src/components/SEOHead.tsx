import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description: string
  path?: string
}

const BASE_URL = 'https://arnaudriegert.github.io/cubedup'

export default function SEOHead({ title, description, path = '' }: SEOHeadProps) {
  const fullTitle = title === 'Home' ? 'cubedup — Algorithms that unlock each other' : `${title} | cubedup`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  )
}
