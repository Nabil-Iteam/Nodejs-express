const express = require('express');

const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
// initialiser file name a vide
fileName = '';

//param de uplolad fichier
const mystorage = multer.diskStorage({
    destination: './uploads',
    fileName: (req, file, redirect) => {

        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null, fl);
        fileName = fl;
    }
})

const upload = multer({ storage: mystorage });

// crud product ********************* ****************************************/

//create Product
router.post('/createProd', upload.any('image'), async (req, res) => {

    try {
        data = req.body;
        prod = new Product(data);
        prod.image = fileName;
        savedProd = await prod.save();
        fileName = '';
        res.status(200).send(savedProd);

    }

    catch (error) {
        res.status(400).send(error)
    }
});

//get allProduct

router.get('/allProd', async (req, res) => {

    try {

        products = await Product.find();

        res.status(200).send(products);

    }
    catch (err) {
        res.status(400).send(err)
    }
})

//get product by Id

router.get('/findOneProd/:id', async (req, res) => {
    try {
        myid = req.params.id;
        myProd = await Product.findOne({ _id: myid });
        res.status(200).send(myProd);

    } catch (error) {
        res.status(400).send(error)
    }
})

//delete product 

router.delete('/deleteProd/:id', async (req, res) => {
    try {
        myId = req.params.id

        deleteProd = await Product.findOneAndDelete({ _id: myId })

        res.status(200).send(deleteProd)

    } catch (error) {

        res.status(400).send(error)

    }
})

//update Product

router.put('/uptProd/:id', async (req, res) => {

    try {
        myId = req.params.id;

        newData = req.body;

        uptProd = await Product.findByIdAndUpdate({ _id: myId }, newData);

        res.status(200).send(uptProd);

    } catch (error) {
        res.status(400).send(error)

    }

});



module.exports = router;