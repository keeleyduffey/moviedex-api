require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
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

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
