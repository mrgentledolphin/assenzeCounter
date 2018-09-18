const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

/* mongodb */
const mongoDB = 'mongodb://stella:123stella@ds259912.mlab.com:59912/assenze'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const elencoModel = require('./elenco.js')

express()
    /* Middleware */
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .set('view engine', 'hjs')
    .use(express.static(__dirname + './views/'))

    /* routing */
    .get('/', (req, res) => {
        
        elencoModel.findOne({}, (err, assenze) => {
            let percRimanenti = Math.round((assenze.oreRimanenti / 264) * 100) + '%'
            let giorniRimanenti = Math.round(assenze.oreRimanenti / 6)
            let tot = (264 - assenze.oreRimanenti) + assenze.oreGiustificate
            res.render('index', {
                assenze,
                percRimanenti,
                giorniRimanenti,
                tot
            })
        })
    })

    .post('/add', (req, res) => {
        let ore = req.body.ore
        let tipo = req.body.tipo
        elencoModel.findOne({}, (err, assenze) => {
            if (tipo == 'Assenza') {
                assenze.assenze++
                assenze.oreRimanenti -= ore
            } else if (tipo == 'Ritardo') {
                assenze.ritardi++
                assenze.oreRimanenti -= ore
            } else {
                assenze.oreGiustificate += ore
            }
            assenze.save(err => {
                res.send('Aggiunta!')
                if (err) {
                    console.log(err)
                }
            })
        })
    })

    .listen(80)