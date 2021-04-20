const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const password = 'LAbuTv8TzNOdc6wt';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdjur.mongodb.net/Card?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err, 'database connected');
    const productCollection = client.db("Card").collection("item");
    const adminCollection = client.db("Card").collection("admin");
    const reviewCollection = client.db("Card").collection("review");
    const oderCollection = client.db("Card").collection("oderitem");

    app.get("/products", (req, res) => {
        productCollection.find()
            .toArray((err, product) => {
                res.send(product);
            })
    })

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        console.log("adding products", products);
        productCollection.insertOne(products)
            .then(result => {
                console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.get(`/product/:id`, (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
            })
    });

    app.post("/addAdmin", (req, res) => {
        const admin = req.body;
        console.log("adding products", admin);
        adminCollection.insertOne(admin)
            .then(result => {
                console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.post("/addReview", (req, res) => {
        const review = req.body;
        console.log("adding products", review);
        reviewCollection.insertOne(review)
            .then(result => {
                console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });


    app.get("/reviews", (req, res) => {
        reviewCollection.find()
            .toArray((err, review) => {
                res.send(review);
            })
    });

    app.post("/addOder", (req, res) => {
        const oder = req.body;
        console.log("adding products", oder);
        oderCollection.insertOne(oder)
            .then(result => {
                console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });
    app.get("/oderList", (req, res) => {
        oderCollection.find()
            .toArray((err, product) => {
                res.send(product);
            })
    });
    app.get("/oderListSpecific", (req, res) => {
        console.log(req.query.email);
        oderCollection.find({ email: req.query.email })
            .toArray((err, productItem) => {
                res.send(productItem);
            })
    });
    app.post('/isDeveloper', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, developer) => {
                res.send(developer.length > 0);
            });
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);