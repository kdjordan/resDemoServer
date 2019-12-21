const homesCollection = require('../db').db().collection('homes');
const userFunctions = require('./userController.js')
const ObjectID = require('mongodb').ObjectID;

exports.apiGetHomeById = (req, res) => {
    homesCollection.aggregate(
        [{$match: {_id: new ObjectID(req.params.id)}},
            {$project: {
                homeName: 1,
                homeUrl: 1
            }
        }]).toArray()
        .then((data) => {
            res.send(data[0])
        }).catch((e) => {
            res.send(e)
        });
}

exports.apiDeleteHome = (req, res) => {
    console.log(req.params)
    if(ObjectID.isValid(req.params.id)) {
        homesCollection.deleteOne({_id: new ObjectID(req.params.id)}).
        then((data) => {
            res.send(req.params.id)
        }).catch((e) => {
            res.send('error')
        })
    }
}

exports.apiAddHome = (req, res) => {
    req.body.activeUsersArr.forEach(user => {
        userFunctions.updateUserHomesArray(user._id, user.homesArray);
    })
    const insertObj = {
        homeName: req.body.homeName,
        homeUrl: 'mt-hood.jpg'
    }
    homesCollection.insertOne(insertObj)
    .then((response) => {
        console.log(response.ops[0])
        let returnData = {
            _id: response.ops[0]._id,
            homeName: response.ops[0].homeName
        }
        res.send(returnData)
    }).catch((e) => {
        res.send('error')
    })
}

exports.apiUpdateHome = (req, res) => {
    console.log(req.body)
    req.body.activeUsersArr.forEach(user => {
        userFunctions.updateUserHomesArray(user._id, user.homesArray);
    })
    const insertObj = {
        homeName: req.body.homeName,
        homeUrl: req.body.homeUrl
    }
    homesCollection.findOneAndUpdate(
        { _id: new ObjectID(req.params.id) },
        { $set: insertObj }
    ).then((data) => {
        res.send('success')
    }).catch((e) => {
        res.send(e)
    });
}


// exports.register = async function(req, res) {
//     try {
//         let newHome = new Home(req.body);
//         if(newHome.register()){
//             req.flash('adminTitleMessage', "home added successfully");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             });
//         } else {
//             req.flash('adminTitleMessage', "Uh OH - That didn't work !");
//             req.session.save(function() {
//                 res.redirect('/admin');
//             })
//         }

//     } catch(e) {
//         res.render('404', e);
//     }
// };


