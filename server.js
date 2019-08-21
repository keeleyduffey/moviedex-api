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
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
}) 

function handleGetMovie(req, res) {

	const genre = req.query.genre && req.query.genre.toLowerCase();
	const country = req.query.country && req.query.country.toLowerCase();
	const avg_vote = Number(req.query.avg_vote);

	let response = MOVIES;
	if (genre) {
		response = response.filter(movie =>
			movie.genre.toLowerCase().includes(genre));
	}

	if (country) {
		response = response.filter(movie =>
			movie.country.toLowerCase().includes(country));
	}

	if (avg_vote) {
		response = response.filter(movie =>
			movie.avg_vote >= avg_vote);
	}

	return res.json(response);
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
