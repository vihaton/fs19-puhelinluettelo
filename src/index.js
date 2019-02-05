const express = require('express')
const app = express()

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