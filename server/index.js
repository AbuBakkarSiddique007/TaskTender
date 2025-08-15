const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p62hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const db = client.db("TaskTender-DB")
    const jobCollection = db.collection("jobs")
    const bidsCollection = db.collection("bids")

    //1. Post(save) job data in db
    app.post("/add-job", async (req, res) => {
      const jobData = req.body
      const result = await jobCollection.insertOne(jobData)

      console.log(result);
      res.send(result)
    })

    // 2. Get data from DB
    app.get("/jobs", async (req, res) => {
      const result = await jobCollection.find().toArray()
      res.send(result)
    })

    // 3. Get all jobs posted by Specific user
    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { 'buyer.email': email }
      const result = await jobCollection.find(filter).toArray()
      res.send(result)
    })

    // 4. Delete a specific job from DB
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.deleteOne(query)
      res.send(result)
    })

    // 5. Get specific post data from db (For update it)
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }

      const result = await jobCollection.findOne(filter)
      res.send(result)
    })

    // 6 Update job post (Similar to post method)
    app.put("/update-job/:id", async (req, res) => {
      const id = req.params.id
      const jobData = req.body

      const update = {
        $set: jobData
      }

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const result = await jobCollection.updateOne(filter, update, options)
      console.log(result);
      res.send(result)
    })


    //7 Post(save) bids data in db
    app.post("/add-bid", async (req, res) => {
      const bidData = req.body

      // 0 : if a user already bid in this job
      const query = { email: bidData.email, jobId: bidData.jobId }
      const alreadyExist = await bidsCollection.findOne(query)
      if (alreadyExist) return res.status(400).send("You have already placed this job.")


      // 1: Save data in  bidsCollection
      const result = await bidsCollection.insertOne(bidData)

      // 2: Increase bids count in jobs collection
      const filter = { _id: new ObjectId(bidData.jobId) }
      const update = {
        $inc: { bid_count: 1 }

      }
      const updateBidCound = await jobCollection.updateOne(filter, update)
      console.log(updateBidCound);
      res.send(result)
    })

    // // 8. Get all bids for a specific person
    // app.get("/bids/:email", async (req, res) => {
    //   const email = req.params.email
    //   const filter = { email: email } //Or: {email}
    //   const result = await bidsCollection.find(filter).toArray()
    //   res.send(result)
    // })

    // // 9. Get all bid requests for a specific user
    // app.get("/bid-requests/:email", async (req, res) => {
    //   const email = req.params.email
    //   const filter = { buyer: email }
    //   const result = await bidsCollection.find(filter).toArray()
    //   res.send(result)
    // })


    // 8. Get all bids for a specific person
    app.get("/bids/:email", async (req, res) => {
      const email = req.params.email
      const isBuyer = req.query.buyer

      console.log("Email:", email, "Is buyer query?:", isBuyer)

      // const filter = { email: email } //Or: {email}

      let filter = {}
      if (isBuyer) {
        filter.buyer = email
      }
      else {
        filter.email = email
      }

      const result = await bidsCollection.find(filter).toArray()
      res.send(result)
    })

    // 9. Get all bid requests for a specific user
    app.get("/bid-requests/:email", async (req, res) => {
      const email = req.params.email
      const filter = { buyer: email }
      const result = await bidsCollection.find(filter).toArray()
      res.send(result)
    })

    // 10. Update bid Status
    app.patch("/bid-status-update/:id", async (req, res) => {
      const id = req.params.id
      const { status } = req.body

      console.log("Updating bid:", id, "to status:", status)

      try {
        const filter = { _id: new ObjectId(id) }
        const updated = {
          $set: { status }
        }

        const result = await bidsCollection.updateOne(filter, updated)

        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Bid not found or status unchanged" })
        }

        res.send(result)
      } catch (error) {
        console.error("Error updating bid status:", error)
        res.status(400).send({ error: error.message })
      }
    })

    // 11. All Jobs
    app.get('/all-jobs', async (req, res) => {
      const filter = req.query.filter
      const search = req.query.search
      const sort = req.query.sort

      let query = {
        title: {
          $regex: search,
          $options: 'i'
        }
      }

      let options = {};
      if (sort) {
        options.sort = {
          date: sort === 'asc' ? 1 : -1  
        };
      }

      const result = await jobCollection.find(query, options).toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )

  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from TaskTender Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
