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





// exports.apiUpdateUser = function(req, res) {
//     try{
//         let user = new User(req.body);
//         if(user.update(req.body, req.body._id)){
//             res.json('success')
//         } else {
//            res.json('failed')
//         }

//     } catch {
//         console.log('db connection failed')
//         res.json('failed - db connection')
//     }
// }

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




// exports.home = function(req, res) {
//         if(req.session.user) {
//             //get reservations for all applicable homes -> session data needs to include that
//             res.render('home-logged-in', {username: req.session.user.username});
//         } else {
//             res.render('home-not-logged-in', {logInError: req.flash('logInError')});
//         }
// };

// exports.login = function(req, res) {
//         let user = new User(req.body);
//         user.login().then(function(result) {
//             req.session.user = {username: user.data.username, _id: user.data._id, role: user.data.role, homesArr: user.data.homesArr};
//             req.session.save(function() {
//                 res.redirect('/');
//             });
//         }).catch(function(e) {
//             req.flash('errors', e);
//             req.session.save(function() {
//                 res.redirect('/');
//             })
//         });    
// };

// exports.logout = function(req, res) {
//     req.session.destroy(function(){
//         res.redirect('/');
//     });
// };

// exports.registerKeeper = async function(req, res) {
    
//     let data = {
//         username: req.body.keeperName,
//         password: req.body.keeperPassword,
//         roles: 'keeper',
//         checkBoxHomesArr: req.body.checkBoxKeepersArr
//     };
//     try {
//         let user = new User(data);
//         if(user.register()) {
//             req.flash('adminTitleMessage', "keeper added successfully");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             })
           
//         } else {
//             req.flash('adminTitleMessage', "Uh OH - It didn't work !");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             })
//         }
//     } catch {
//         res.send('Error adding new User');
//     }
    
// }


// exports.register = async function(req, res) {
//     console.log(req.body);
//     try {
//         let user = new User(req.body);
//         // if(user.register()) {
//         //     req.flash('adminTitleMessage', "user added successfully");
//         //     req.session.save(function() {
//         //         res.redirect('/admin');
//         //     })
           
//         // } else {
//         //     req.flash('adminTitleMessage', "Uh OH - It didn't work !");
//         //     req.session.save(function() {
//         //         res.redirect('/admin');
//         //     })
//         // }
//     } catch {
//         res.send('Error adding new User');
//     }
// };

// exports.getUserDataById = async function(req, res) {
//     try {
//         let user = await User.getUserData(req.body.usernameId);
//         res.json(user);
//     } catch(e) {
//         res.send(e);
//     }
// };

// exports.delete = async function(req, res) {
//        try {
//            let confirmation = await User.delete(req.params.id);
//            if (confirmation == 'success') {
//                res.json(true);
//            } else {
//             res.json(false);
//            }
//        } catch {
//            res.render('404', {adminErrors: 'Problem Connecting to DB'})
//        }
// };

// exports.update = async function(req, res)  {
//     try{
//         let user = new User(req.body)
//         if(user.update(req.body, req.params)){
//             req.flash('adminTitleMessage', "user updated successfully");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             })
//         } else {
//             req.flash('adminTitleMessage', "Uh Oh that didn't work");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             })
//         }

//     } catch {
//         res.render('404', {adminErrors: 'Problem Connecting to DB'})
//     }
// }


