const homesCollection = require('../db').db().collection('homes');
const ObjectID = require('mongodb').ObjectID;

let Home = function(data) {
    this.data = data;
    this.errors = [];
}

Home.getHomeData = async function(id) {
    try {
        let HomeDoc = await homesCollection.aggregate(
            [{$match: {_id: new ObjectID(id)}},
                {$project: {
                    homeName: 1,
                    homeUrl: 1
                }
            }].toArray());
        console.log(HomeDoc)
    } catch(e) {
        console.log(e);
    }
    
} 

Home.prototype.cleanUp = function() {
    if(typeof(this.data.homeUrl) != 'string') {this.data.homeUrl = '';}
    if(typeof(this.data.homeName) != 'string') {this.data.homeName = '';}

    this.data = {
        homeUrl: this.data.homeUrl.trim().toLowerCase(),
        homeName: this.data.homeName.trim().toLowerCase()
    }
}

Home.prototype.register = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        if(!this.errors.length) {
            homesCollection.insertOne(this.data).then(() => {
                resolve();
            }).catch((e) => {
                reject(e)
            });
        } else {
            reject('Please try again Later');
        }
    })
    
}


module.exports = Home;