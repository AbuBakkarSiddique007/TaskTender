const express = require('express')
const cors = require('cors')

// a1
const jwt = require('jsonwebtoken')
// b1
const cookieParser = require('cookie-parser')


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()
// a3
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://tasktender-971aa.web.app",
    "https://tasktender-971aa.firebaseapp.com",
  ],
  credentials: true,
  optionsSuccessStatus: 200
}
// a4
app.use(cors(corsOptions))
app.use(express.json())
// b2
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p62hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// b3
// Verify Token
const verifyToken = async (req, res, next) => {

  const token = req.cookies?.token
  if (!token) return res.status(401).send("Unauthorized")
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Forbidden")
    }
    req.user = decoded
    next()
  })

  console.log("Token verify ");
}


async function run() {
  try {
    // OpportuneX
    const db = client.db("OpportuneX-DB")
    const jobCollection = db.collection("jobs")
    const bidsCollection = db.collection("bids")

    //a2
    app.post('/jwt', async (req, res) => {
      const { email } = req.body

      if (!email) {
        return res.status(400).send({ error: 'Email is required' })
      }

      // Create token
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '365d' })
      console.log('JWT created for:', email)

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      }).send({ success: true })
    })

    // a5. logOut || Clear token
    app.get('/logOut', (req, res) => {
      res.clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        httpOnly: true
      })
      res.send({ success: true })
    })

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
    app.get("/jobs/:email", verifyToken, async (req, res) => {
      const decodedEmail = req.user?.email

      const email = req.params.email;

      console.log("Email from token:", decodedEmail);
      console.log("Email from params:", email);

      if (decodedEmail !== email) {
        return res.status(403).send("Forbidden")
      }
      const filter = { 'buyer.email': email }
      const result = await jobCollection.find(filter).toArray()
      res.send(result)
    })

    // 4. Delete a specific job from DB
    app.delete("/job/:id", verifyToken, async (req, res) => {
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
    app.get("/bids/:email", verifyToken, async (req, res) => {

      const decodedEmail = req.user?.email

      const email = req.params.email
      const isBuyer = req.query.buyer

      // console.log("Email:", email, "Is buyer query?:", isBuyer)
      // const filter = { email: email } //Or: {email}

      console.log("Email from token:", decodedEmail);
      console.log("Email from params:", email);

      if (decodedEmail !== email) {
        return res.status(403).send("Forbidden")
      }

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
    // app.get("/bid-requests/:email", async (req, res) => {
    //   const email = req.params.email
    //   const filter = { buyer: email }
    //   const result = await bidsCollection.find(filter).toArray()
    //   res.send(result)
    // })

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
      const filter = req.query.filter;
      const search = req.query.search;
      const sort = req.query.sort;

      // Build query object
      let query = {};

      // Title search
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      // Category filter
      if (filter) {
        query.category = filter;
      }

      let options = {};
      if (sort) {
        options.sort = {
          date: sort === 'asc' ? 1 : -1
        };
      }

      try {
        const result = await jobCollection.find(query, options).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch jobs' });
      }
    });


    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )

  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from OpportuneX Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
