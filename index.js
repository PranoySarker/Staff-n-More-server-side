const express = require('express');
const app = express();
const cors = require('cors');
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
            // console.log(req.query)
            // console.log(req.query.userName);
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