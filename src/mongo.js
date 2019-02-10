
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

//const url = `mongodb://xvixvi:${password}@cluster0-shard-00-00-guglj.mongodb.net:27017,cluster0-shard-00-01-guglj.mongodb.net:27017,cluster0-shard-00-02-guglj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`
const url = `mongodb+srv://xvixvi:${password}@cluster0-guglj.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true }).catch(error => {
    console.log('failed to connect with error', error);    
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {
    console.log("puhelinluettelo:");

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number);
            
        })
        mongoose.connection.close()
        process.exit(1)
    })
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: Math.ceil(Math.random() * 666000)
})

person.save().then(response => {
  console.log(`lisätään ${person.name} numero ${person.number} luetteloon`);
  
  mongoose.connection.close();
}).catch(error => {
    console.log(`ERROR @ saving person: ${error}`);
})