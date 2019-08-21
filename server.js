require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
	const apiToken = process.env.API_TOKEN
	const authToken = req.get('Authorization')

  console.log('validate bearer token middleware')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

/*

When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive.
When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive.
When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number.
The API responds with an array of full movie entries for the search results


The endpoint should have general security in place such as best practice headers and support for CORS.

*/ 

function handleGetMovie(req, res) {

	const genre = req.query.genre && req.query.genre.toLowerCase();
	const country = req.query.country && req.query.country.toLowerCase();
	const averageVote = Number(req.query.averageVote);

	let response = [];
	if (genre) {
		response = MOVIES.filter(movie =>
			movie.genre.toLowerCase().includes(genre));
	}

	if (country) {
		response = MOVIES.filter(movie =>
			movie.country.toLowerCase().includes(country));
	}

	if (averageVote) {
		response = MOVIES.filter(movie =>
			movie.avg_vote >= averageVote);
	}

	if (!genre && !country && !averageVote) response = MOVIES;

	return res.json(response);
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
