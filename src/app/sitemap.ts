import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://wordunscramblegame.com',
      lastModified: new Date(),
    },
    {
      url: 'https://wordunscramblegame.com/unscramble',
      lastModified: new Date(),
    },
    {
      url: 'https://wordunscramblegame.com/anagram-solver',
      lastModified: new Date(),
    },
    {
      url: 'https://wordunscramblegame.com/streak-challenge',
      lastModified: new Date(),
    },
    {
      url: 'https://wordunscramblegame.com/about',
      lastModified: new Date(),
    },
  ]
}
