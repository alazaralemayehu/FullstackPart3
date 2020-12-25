const http = require('http')
const morgan = require('morgan')

const express = require('express')
const { response } = require('express')
const { filter } = require('methods')
const app = express()
app.use(express.json())


let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    } 
]


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

const getRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(1000000000));
}


app.get('/info', (request, response)=> {
    const messsage = `Phone book has info for ${persons.length} people
    ${new Date()}
    `
    response.send(messsage)
})

app.get('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id)
    console.log(persons[0])
    const person = persons.find(person => person.id === id) 
    console.log(person)
    if (person) {
        response.json(person)
    } else {
        
        return response.status(400).json({message:`no data with id ${id}`})
    }

})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    const fitlteredPersons  = persons.filter(person => person.id !== id)
    persons = fitlteredPersons
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const name = body.name
    const number = body.number

    if (!name) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (!number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const personExists = persons.find(person => person.name === name)
    if (personExists) {
        return response.status(409).json({
            error: 'name should be unique'
        })
    }
    const person = {
        id: getRandomInt(),
        name : name,
        number: number
    }
    persons = persons.concat(person)
    response.json(person)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
