const axios = require('axios');

export default async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    const searchItem = req.query.searchItem;
    console.log('searchItem: ', searchItem);
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchItem)}&include_adult=false&language=en-US&page=1`;
  
    try {
        const response = await axios.get(url);
        console.log('response: ', response.data.results);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching multi data from TMDB', error: error.message });
    }
  }
