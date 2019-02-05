const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('person', function getPerson (req) {
    str = JSON.stringify(req.body)
    if (str === "{}") {
        return ""
    }
    return JSON.stringify(req.body)
  })
  

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
    console.log('api/persons');

    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    console.log('api/persons/:id');
    
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    console.log("person with id ", id, person);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
      }
    
    persons = persons.concat(person)

    response.json(person)
  })

const generateId = () => {
    rid = Math.ceil(Math.random() * 666)

    return rid
}

app.get("/info", (req, res) => {
    res.send(`<div>
                <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                ${new Date()}
            </div>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})