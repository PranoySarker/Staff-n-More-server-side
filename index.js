const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vmhyc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolCollection = client.db("staff-n-more").collection("tools");
        const orderCollection = client.db("staff-n-more").collection("orders");
        const userCollection = client.db("staff-n-more").collection("users");

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: (ObjectId(id)) };
            const result = await toolCollection.findOne(query);
            res.send(result);
        })

        app.get('/order', async (req, res) => {
            const userName = req.query.userName;
            const query = { userName: userName };
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/order', async (req, res) => {
            const order = req.body;
            const query = { productName: order.productName, userName: order.userName }
            const exists = await orderCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, order: exists })
            }
            const result = await orderCollection.insertOne(order);
            res.send({ success: true, result });
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        console.log('database connected');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('connect to db');
//     // perform actions on the collection object
//     // client.close();

// });



app.get('/', (req, res) => {
    res.send('Hello staff!!!');
})

app.listen(port, () => {
    console.log('Listening to the Staff port');
})