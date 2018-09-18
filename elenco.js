const mongoose = require('mongoose')

let Schema = mongoose.Schema

let elencoSchema = new Schema({
    oreRimanenti: Number,
    assenze: Number,
    ritardi: Number,
    oreGiustificate: Number,
    nome: String
}, { collection : 'elenco' })

module.exports = mongoose.model('elenco', elencoSchema)