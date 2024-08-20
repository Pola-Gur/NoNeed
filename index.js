const express = require('express');
const app = express();
const cors = require('cors');
const sql = require('./app');


const PORT = process.env.PORT || 3001;

app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello from new No Need server!')
})

app.get('/check-db', async (req, res) => {
    try {
        const result = await sql`select version()`;
        res.send(`Database connected: ${result[0].version}`);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send('Error');
    }
});


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})