const express = require('express');
const app = express();
const cors = require('cors');


const PORT = 3001 // || из .env

app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello from new No Need server!')
})


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})