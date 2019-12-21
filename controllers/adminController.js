//require admin 
const homesCollection = require('../db').db().collection('homes');
const usersCollection = require('../db').db().collection('users');
const jwt = require('jsonwebtoken');
// const keepersCollection = require('../db').db().collection('keepers');

exports.apiGetMenuData = async function(req, res) {
    try{
        let usersArrPromise  = this.getUsersData();
        let homesArrPromise = this.getHomesData();  
        let keepersArrPromise = this.getKeepersData();
        let [usersArr, homesArr, keepersArr] = await Promise.all([usersArrPromise, homesArrPromise, keepersArrPromise]);

        const menuData = {
            users: usersArr,
            homes: homesArr,
            keepers: keepersArr
        }
        res.send(menuData);
    } catch(e) {
        res.send(e)
    }
}

getUsersData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let usersDoc = await usersCollection.find().toArray();
            //take password out of usersDoc
            if(usersDoc.length > 0) {
                let theReturn = [];
                usersDoc.forEach(user => {
                    if(user.role != 'keeper'){
                        theReturn.push({_id: user._id, userName: user.userName, homesArray: user.homesArray});
                    }
                });
                resolve(theReturn);
            } else {
                reject('error getting users')
            }
        } catch (e) {
            reject(e);
        }
    })
}

getHomesData = () => {
    return new Promise (async (resolve, reject) => {
        try {
            let homesDoc = await homesCollection.find().toArray();   
            if(homesDoc.length > 0){
            //clean URL from homesDoc
            let theReturn = [];
            homesDoc.forEach(home => {
                    theReturn.push({_id: home._id, homeName: home.homeName, URL: home.homeUrl});
            });
                resolve(theReturn);
            } else {
                reject('error getting homes')
            }
        } catch (e) {
            reject(e);
        }
    });
}

getKeepersData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let keepersDoc = await usersCollection.aggregate([
                {$match: {role: "keeper"}}]).toArray();
            //take password out of keeperssDoc
            if(keepersDoc.length > 0) {
                let theReturn = [];
                keepersDoc.forEach((keeper) => {
                    theReturn.push({_id: keeper._id, keeperName: keeper.userName});
                });
                resolve(theReturn);
            } else {
                reject('error getting keepers')
            }
        } catch (e) {
            reject(e);
        }
    })
}







//exports.name = function(req, res) {}

// exports.home = async function(req, res) {
//     // console.log(req.session.user);
//    res.render('admin-register', {
//        adminName: req.session.user.username,
//        usersArr: req.usersArr, 
//        homesArr: req.homesArr, 
//        keepersArr: req.keepersArr,
//        adminTitleMessage: req.flash('adminTitleMessage')
//     });
// }




// exports.isAdmin = function(req, res, next) {
//     if (req.session.user.role == 'admin') {
//         next();
//     } else {
//         req.flash('adminErrors', "You must Be an Admin to Visit that area");
//         req.session.save(function() { 
//             res.render(('404'), {adminErrors: req.flash('adminErrors')})
//         });
//     }   
// }


