async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  
    try {
      const tmdbResponse = await fetch(url);
      const data = await tmdbResponse.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data from TMDB', error: error.message });
    }
  }
  
  module.exports = handler;