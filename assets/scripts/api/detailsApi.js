const API_KEY = '8c4b867188ee47a1d4e40854b27391ec'; // Replace with your TMDB key
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMovieDetails(movieId) {
  try {
    // Main request for movie info
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`),
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`)
    ]);

    if (!detailsRes.ok || !creditsRes.ok) {
      throw new Error('Error retrieving data');
    }

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    // Take the first 5 main actors
    const actors = credits.cast.slice(0, 5).map(actor => ({
      name: actor.name,
      character: actor.character,
      photo: actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
        : null
    }));

    return {
      id: details.id,
      title: details.title,
      overview: details.overview,
      poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
      rating: details.vote_average,
      release_date: details.release_date,
      genres: details.genres.map(g => g.name),
      actors: actors
    };
  } catch (error) {
    console.error('Error in fetchMovieDetails:', error);
    return null;
  }
}

export async function fetchSeriesDetails(id) {
    const BASE_URL = 'https://api.themoviedb.org/3';
    const API_KEY = '8c4b867188ee47a1d4e40854b27391ec';
  
    async function fetchWithLanguage(lang) {
      const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${lang}&append_to_response=credits`);
      if (!response.ok) throw new Error("Error loading series details");
      return response.json();
    }
  
    try {
      let data = await fetchWithLanguage('fr-FR');
  
      // If the overview is empty, retry in English
      if (!data.overview || data.overview.trim() === '') {
        console.warn('French overview unavailable, loading in English...');
        const fallbackData = await fetchWithLanguage('en-US');
        data.overview = fallbackData.overview;
      }
  
      return {
        title: data.name,
        release_date: data.first_air_date,
        overview: data.overview,
        rating: data.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        genres: data.genres.map(g => g.name),
        actors: data.credits?.cast.slice(0, 10).map(a => ({
          name: a.name,
          character: a.character,
          photo: a.profile_path ? `https://image.tmdb.org/t/p/w200${a.profile_path}` : null
        }))
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

// Example usage
fetchMovieDetails(550) // 550 = Fight Club
  .then(data => console.log(data));

export { fetchMovieDetails };