/* scripts/backfill-restriction-slugs.js */
import { PrismaClient } from "@prisma/client";
import slug from 'slug'

const prisma = new PrismaClient();
/**
 * IMPORTANT:
 * Replace this with an import of YOUR updated slug function if possible, e.g.
 *   const { makeRestrictionsSlug } = require("../src/lib/slug");
 *
 * This function must deterministically map a Restrictions row -> slug string.
 */
const genres = [
    {
      id: 10759,
      name: 'Action & Adventure',
    },
    {
      id: 16,
      name: 'Animation',
    },
    {
      id: 35,
      name: 'Comedy',
    },
    {
      id: 80,
      name: 'Crime',
    },
    {
      id: 99,
      name: 'Documentary',
    },
    {
      id: 18,
      name: 'Drama',
    },
    {
      id: 10751,
      name: 'Family',
    },
    {
      id: 10762,
      name: 'Kids',
    },
    {
      id: 9648,
      name: 'Mystery',
    },
    {
      id: 10763,
      name: 'News',
    },
    {
      id: 10764,
      name: 'Reality',
    },
    {
      id: 10765,
      name: 'Sci-Fi & Fantasy',
    },
    {
      id: 10766,
      name: 'Soap',
    },
    {
      id: 10767,
      name: 'Talk',
    },
    {
      id: 10768,
      name: 'War & Politics',
    },
    {
      id: 37,
      name: 'Western',
    },
    {
      id: 28,
      name: 'Action',
    },
    {
      id: 12,
      name: 'Adventure',
    },
    {
      id: 14,
      name: 'Fantasy',
    },
    {
      id: 36,
      name: 'History',
    },
    {
      id: 27,
      name: 'Horror',
    },
    {
      id: 10402,
      name: 'Music',
    },
    {
      id: 10749,
      name: 'Romance',
    },
    {
      id: 878,
      name: 'Science Fiction',
    },
    {
      id: 10770,
      name: 'TV Movie',
    },
    {
      id: 53,
      name: 'Thriller',
    },
    {
      id: 10752,
      name: 'War',
    },
  ]

const mediaTypes = {
    Movie: {
      url: 'movie',
      display: 'Movie',
      urlPlural: 'movies',
      plural: 'Movies',
    },
    TvShow: {
      url: 'tv',
      display: 'TV Show',
      urlPlural: 'shows',
      plural: 'Shows',
    },
    TvSeason: {
      url: 'season',
      display: 'Season',
      urlPlural: 'seasons',
      plural: 'Seasons',
    },
    TvEpisode: {
      url: 'episode',
      display: 'Episode',
      urlPlural: 'episodes',
      plural: 'Episodes',
    },
    Person: {
      url: 'person',
      display: 'Person',
      plural: 'people',
      urlPlural: 'people',
      excludeForLists: true,
    },
  }

  function getGenreById(id) {
    return genres.find(g => g.id === id)
  }

function getListTitle({
    restrictions,
    isDetailView,
    isForSlug,
    tvShowLogoFilePath,
    includeTopFive,
  }) {
    const {
      mediaType,
      year,
      Person,
      isLiveActionOnly,
      genreId,
      episodesTvShowId,
      EpisodesTvShow,
      Network,
    } = restrictions
  
    let title = ''
  
    if (year) {
      title += year > 10000 ? `${year / 10}s ` : `${year} `
    }
  
    if (Person?.name) {
      title += `${Person.name} `
    }
  
    if (isLiveActionOnly) {
      title += 'Live-Action '
    }
  
    if (Network?.id) {
      title +=
        isForSlug || !isDetailView
          ? `${Network.name} `
          : `<img style="max-height: 175px;" class="drop-shadow-2xl dark:rounded-xl dark:bg-white dark:p-1"'> `
    }
  
    if (genreId) {
      title += `${getGenreById(genreId)?.name} `
    }
  
    if (includeTopFive || (!title.trim() && !episodesTvShowId)) {
      title += 'Top Five '
    }
  
    if (EpisodesTvShow?.name) {
      title += tvShowLogoFilePath
        ? `<img style="max-height: 175px;" class="drop-shadow-xl"> `
        : `${EpisodesTvShow.name} `
    }
  
    if (isDetailView) {
      const replaced = episodesTvShowId ? 'TV' : ''
      const plural = mediaTypes[mediaType].plural.replace(replaced, '')
      title += `${plural} `
    }
  
    if(isForSlug && EpisodesTvShow?.id) {
      title += `${EpisodesTvShow.id.toString()}`
    }
  
    return title.trim()
  }

function makeRestrictionsSlug(restrictions) {
    const title = getListTitle({ restrictions, isDetailView: true, isForSlug: true })
    return slug(title)
  }

async function main() {
  const restrictions = await prisma.restrictions.findMany({
    include: {
        Person: true,
        EpisodesTvShow: true,
        Network: true,
    }
  });

  const changes = [];
  const newSlugToOld = new Map();

  for (const r of restrictions) {
    const newSlug = makeRestrictionsSlug(r);

    if (!newSlug || typeof newSlug !== "string") {
      throw new Error(`Computed empty/invalid slug for old slug=${r.slug}`);
    }

    if (newSlug !== r.slug) {
      // collision detection
      if (newSlugToOld.has(newSlug)) {
        const otherOld = newSlugToOld.get(newSlug);
        throw new Error(
          `Slug collision: "${otherOld}" and "${r.slug}" both map to "${newSlug}".`
        );
      }
      newSlugToOld.set(newSlug, r.slug);
      changes.push({ oldSlug: r.slug, newSlug });
    }
  }

  console.log(`Found ${changes.length} Restrictions slug(s) to update.`);

  if (changes.length === 0) return;

  await prisma.$transaction(
    async (tx) => {
      // Update in a deterministic order (helps debugging)
      changes.sort((a, b) => a.oldSlug.localeCompare(b.oldSlug));

      for (const { oldSlug, newSlug } of changes) {
        await tx.restrictions.update({
          where: { slug: oldSlug },
          data: { slug: newSlug },
        });
      }
    },
    { timeout: 600000 } // 10 min, adjust as needed
  );

  console.log("Done. If your foreign keys have ON UPDATE CASCADE, related tables are updated automatically.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
