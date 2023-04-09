const express = require('express');

const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    data = req.body;

    usr = new User(data);

    //cryptage de mot de pass

    salt = bcrypt.genSaltSync(10);

    cryptedPass = await bcrypt.hashSync(data.password, salt);

    usr.password = cryptedPass;

    usr.save()

        .then(
            (saved) => {
                res.status(200).send(saved)
            }
        )
        .catch(
            (err) => {
                res.status(400).send(err)
            }
        )
});


router.post('/login', async (req, res) => {
    data = req.body;

    usr = await User.findOne({ email: data.email });

    if (!usr) {

        res.status(404).send('email or password in not valid 1!');
    } else {
        validPass = bcrypt.compareSync(data.password, usr.password);

        if (!validPass) {
            res.status(401).send('email or password in not valid !')
        } else {
            payload = {
                _id: usr._id,
                email: usr.email,
                name: usr.name
            }
            token = jwt.sign(payload, '112299')
            res.status(200).send({ mytoken: token })
        }
    }
})

// une deuxieume methode pour add ( plus simple )
router.post('/create', async (req, res) => {

    try {
        data = req.body;

        usr = new User(data);

        savedUser = await usr.save();

        res.send(savedUser);

    }
    catch (error) {
        res.send(error)
    }

    ;

});



router.get('/getAll', (req, res) => {

    User.find()
        .then((users) => {
            res.send(users);
        }
        )
        .catch((err) => {
            res.send(err);
        }
        )
});

//deuxieme methode de get all

router.get('/findAll', async (req, res) => {

    try {

        users = await User.find();

        res.send(users);

    }
    catch (err) {
        res.send(err)
    }
})

router.get('/getById/:id', (req, res) => {
    myid = req.params.id;
    User.findOne({ _id: myid })
        .then((user) => {
            res.send(user);
        }
        )

        .catch(
            (error) => {
                res.send(error)
            }
        )


})
//deixiemr methode de find by one 

router.get('/getOneUser/:id', async (req, res) => {
    try {
        myid = req.params.id;
        myUser = await User.findOne({ _id: myid });
        res.send(myUser);

    } catch (error) {
        res.send(error)

    }
})

// delete User

router.delete('/delete/:id', (req, res) => {

    myid = req.params.id

    User.findOneAndDelete({ _id: myid })

        .then(
            (userDeleted) => {
                res.send(userDeleted)
            }
        )
        .catch(
            (error) => {
                res.send(error)
            })

});

//delete deuxieme methode 

router.delete('/deleteId/:id', async (req, res) => {
    try {
        myId = req.params.id

        deleteUser = await User.findOneAndDelete({ _id: myId })

        res.send(deleteUser)

    } catch (error) {

        res.send(error)

    }
})

//update with async
//best practice status(200 or 400) to facilitate the work of front-end developer

router.put('/upt/:id', async (req, res) => {

    try {
        myId = req.params.id;

        newData = req.body;

        uptData = await User.findByIdAndUpdate({ _id: myId }, newData);

        res.status(200).send(uptData);

    } catch (error) {
        res.status(400).send(error)

    }

});



module.exports = router;