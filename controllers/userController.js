const usersCollection = require('../db').db().collection('users');
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
var xss = require("xss");
const bcrypt = require('bcryptjs');

checkInput = (str) => {
    let pureStr = xss(str);
    if(typeof(pureStr) != 'string') {
        console.log(typeOf(str))
        return false;
    } else {
        return true;
    }
}

exports.apiUpdateUser = function(req, res) {
    let insertObj = req.body;
    usersCollection.findOneAndUpdate(
        { _id: new ObjectID(req.params.id) },
        { $set: insertObj }
    ).then((data) => {
        res.send({
            _id: data.value._id, 
            userName: req.body.userName, 
            homesArray: req.body.homesArray,
            role: req.body.role})
    }).catch((e) => {
        res.send(e)
    });

};

exports.updateUserHomesArray = (id, newHomesArray) => {
    let insertObj = {
        homesArray: newHomesArray
    }
    usersCollection.findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: insertObj }
    )
}


exports.apiAddUser = function(req, res) {
    usersCollection.insertOne(req.body)
    .then((response) => {
        let returnData = {
            _id: response.ops[0]._id,
            userName: response.ops[0].userName,
            role: response.ops[0].role
        }
        res.send(returnData)
    }).catch((e) => {
        res.send('error')
    })
}



exports.apiDeleteUser = function(req, res) {
        if(ObjectID.isValid(req.params.id)) {
            usersCollection.deleteOne({_id: new ObjectID(req.params.id)}).
            then((data) => {
                res.send(req.params.id)
            }).catch((e) => {
                res.send('error')
            })
        }

}
exports.apiLogin = function(req, res) {
    console.log('hitting user login')
    console.log(req.body)
   
    if(this.checkInput(req.body.userName) && this.checkInput(req.body.password)){
        usersCollection.findOne({userName: req.body.userName})
        .then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(req.body.password, attemptedUser.userPassword)) {
                let data = attemptedUser;
                delete data.userPassword;
                //add JWT to response object
                let theToken = jwt.sign( {_id: data._id}, process.env.JWTSECRET, { expiresIn: '30m'})
                data = {...data, token: theToken, expires: 1800}
                res.send(data);
            } else {
                console.log('sending invalid')
                res.send('invalid');
            }
        }).catch((e) => {
            res.send('Please try again later' + e);
        })
    } else {
        res.send('error')
    }
};

exports.apiMustBeLoggedIn = function(req, res, next) {
    
    try {
        let userDoc = jwt.verify(req.body.token, process.env.JWTSECRET);
        if(userDoc) {
            next();
        } else {
            res.send('Invalid Token')
        }
    } catch (e){
        console.log(e)
        res.send('Invalid Token');
    }
};


exports.apiGetUserById = async (req, res) => {
    try {
        let userDoc = await usersCollection.aggregate(
            [{$match: {_id: new ObjectID(req.params.id)}},
              {$project: {
                  userName: 1,
                  homesArray: 1,
                  role: 1
              }
          }]).toArray();
        if(userDoc.length) {
            res.send(userDoc[0]);
        } else {
            res.status(404).send('user not found')
        }
    } catch(e) {
        res.send(e);
    }
};






