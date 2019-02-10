require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')
const morgan = require('morgan')

//---- määrittelyt ---

morgan.token('person', function getPerson (req) {
    str = JSON.stringify(req.body)
    if (str === "{}") {
        return ""
    }
    return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person.toJSON())
        } else {
            response.status(204).end() 
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        console.log('delete succeeded with result:', result);
          
        response.status(204).end()
      })
      .catch(error => next(error))
});

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    } else if (body.number === undefined) {
        return response.status(400).json({
            error: "number missing"
        })
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
    })}

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })

})

const generateId = () => {
    rid = Math.ceil(Math.random() * 666000)

    return rid
}

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<div>
                    <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                    ${new Date()}
                </div>`)
      })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})