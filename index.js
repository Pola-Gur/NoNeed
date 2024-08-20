const express = require('express');
const app = express();
const cors = require('cors');


const PORT = 3000 // || из .env

app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello from No Need server!')
})


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})