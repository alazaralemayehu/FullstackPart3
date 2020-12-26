// mongodb+srv://fullstack:<password>@project0.laffz.mongodb.net/<dbname>?retryWrites=true&w=majority
const mongoose = require ('mongoose')

const addPerson = () => {
    
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
    })
}

const getPersons = () => {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length < 3 ){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]



const url  = ` mongodb+srv://fullstack:${password}@project0.laffz.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false, useCreateIndex: true})

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', PersonSchema)

if (process.argv.length === 5) {
    addPerson()
} else {
    getPersons()
}
