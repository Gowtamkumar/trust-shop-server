const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
const port = 5000
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ty6v7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const pdcollection = client.db("TrushShop").collection("Products");
    const Ordercollection = client.db("TrushShop").collection("Orders");

    // Post oparation
    app.post('/addProduct', (req, res) => {
        const newEvent = req.body;
        pdcollection.insertOne(newEvent)
            .then(result => {
                console.log("data result", result.insertedCount)
                res.send(result.insertedCount > 0)
            })
        console.log("new ", newEvent)
    })

    app.post('/addOrder', (req, res) => {
        const orderData = req.body;
        console.log("back end data", orderData)
        Ordercollection.insertOne(orderData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })
    // Orders by user
    app.get('/Orders', (req, res) => {
        console.log(req.query.email)
        Ordercollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
                console.log(documents[0])
            })
    })

    // View oparation
    app.get('/products', (req, res) => {
        pdcollection.find()
            .toArray((err, documents) => {
                console.log("get method", documents)
                res.send(documents)
            })
    })
    app.get('/product/:id', (req, res) => {
        pdcollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                console.log(documents)
                res.send(documents[0])
            })
    })
    // delete Product
    app.delete('/deleteproduct/:id', (req, res) => {
        pdcollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(document => {
                res.send(document.deletedCount > 0)
            })
    })
    // Order post


    console.log("database connected")
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})