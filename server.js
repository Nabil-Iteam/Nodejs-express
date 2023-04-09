const express = require('express');

const app = express();

require('./config/connect');

app.use(express.json());

const productRoute = require('./routes/product');
const userRoute = require('./routes/user');

app.use('/product', productRoute);
app.use('/user', userRoute);

app.listen(3000, () => {
    console.log("ca marche !!")
});


