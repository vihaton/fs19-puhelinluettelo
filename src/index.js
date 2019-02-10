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

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
    ]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        response.json(person.toJSON())
    })
    .catch(error => {
        console.log('ERROR @ get persons/:id', error);
        response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})