const usersCollection = require('../db').db().collection('users');
const homesCollection = require('../db').db().collection('homes');
const User = require('../models/User');

let Admin = function() {
    this.users = [];
    this.homes = [];
    this.keepers = [];
    this.errors = [];
};


Admin.prototype.getHomesData = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let homesDoc = await homesCollection.find().toArray();
            homesDoc.forEach((home) => {
                this.homes.push({homeUrl: home.homeUrl, homeName: home.homeName, _id: home._id});
            });
            resolve(this.homes);
            
        } catch (e) {
            reject(e);
        }
    })
}

Admin.prototype.getKeepersData = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let keepersDoc = await usersCollection.aggregate([
                {$match: {role: "keeper"}}
            ]).toArray();

            keepersDoc.forEach((keeper) => {
                this.keepers.push({_id: keeper._id, keeperName: keeper.username, keeperHome: keeper.homesArray});
            });
            resolve(this.keepers);
            
        } catch (e) {
            reject(e);
        }
    })
}

Admin.prototype.getUsersData = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let usersDoc = await usersCollection.find().toArray();
            usersDoc.forEach((user) => {
                if(user.role != "keeper") {
                    this.users.push({username: user.username, _id: user._id});
                } 
            });
            resolve(this.users);
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = Admin;