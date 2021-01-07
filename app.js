const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const routeV1 = require('./Routes/routeV1')

const port = 5000

app.use(cors())
app.use(bodyParser.json())
app.use("/images", express.static("images"));


app.use('/api/v1', routeV1)





app.listen(port, () => console.log(`server is running on port: ${port}`))