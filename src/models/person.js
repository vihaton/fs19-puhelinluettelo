const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('commecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
    console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('failed to connect with error', error);    
    })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3},
  number: { type: String, required: true, minlength: 8 },
  id: Number,
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)
