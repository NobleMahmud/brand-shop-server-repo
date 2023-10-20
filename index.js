const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://brandShop:hbphNzKLwmKxUyAu@cluster0.t7f6zl5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("brandsDB").collection("brands");
    const userCollection = client.db("brandsDB").collection("users");
    

    app.get('/addproduct/:brandName', async(req, res)=>{
      const brandNames = req.params.brandName;
      const cursor = productCollection.find({brand: brandNames}); 
      // query find
      const result = await cursor.toArray()
      res.send(result);
    })

    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const result = await productCollection.findOne({_id: new ObjectId(id)})
     res.send(result);
    })
    

    app.post('/addproduct', async(req, res)=>{
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })

    // users db
      app.post('/cart', async(req, res)=>{
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);
      res.send(result)
    })

    app.get('/cart/:email', async(req, res)=>{
      // req theke email ashte hbe (body)
      const email = req.params.email;
     const query = {email: email}
      const cursor = userCollection.find(query);
      const result = await cursor.toArray()
     res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res)=>{
    res.send('brand shop server is running')
})
app.listen(port, ()=>{
    console.log(`brand shop server is running on port ${port}`)
})