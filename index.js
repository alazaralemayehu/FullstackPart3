require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('postDataToken', function(req, res) {
    // custom tokesn should return string
    const body = req.body
    return JSON.stringify(body)
})
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.postDataToken(req, res)
    ].join(' ')
})
)

app.get('/info', (request, response, next) => {
    Person.countDocuments({}).then(count => {
        const messsage = `Phone book has info for ${count} people ${new Date()}`
        response.send(messsage)
    }).catch(error => {
        next(error)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = (request.params.id)

    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        } else {
            return response.status(400).json({ message:`no data with id ${id}` })
        }
    }).catch(error => {
        console.log(error)
        next(error)
    })
})
app.get('/api/persons', (request, response) => {
    console.log('we are here)')
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        number: body.number,
    }
    console.log(request.params.id)

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = (request.params.id)
    Person.findByIdAndRemove(id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    console.log('here')
    const body = request.body

    const person = new Person({
        name : body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        console.log(savedPerson)
        response.json(savedPerson)
    }).catch((error) => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({ error: 'malformed Id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next()
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
