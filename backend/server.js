require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const {createCustomer,SetupIntent}= require('./payment');

app.use(express.json());
app.use(cors());
app.post('/create-customer',createCustomer);
app.post('/setup-intent',SetupIntent);

try {
    const port = process.env.PORT || 3300;
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`server is listening on port:${port}`);
    })
    } catch (error) {
        console.log("Error", error);
    }
    
