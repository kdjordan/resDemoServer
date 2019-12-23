const reservationsCollection = require('../db').db().collection('reservations');
const ObjectID = require('mongodb').ObjectID;
const sanitizeHTML = require('sanitize-html');

exports.apiUpdateReservation = (req, res) => {
    let insertObj = {
        resDates: `${req.body.start} to ${req.body.end}`,
        guest: req.body.guest,
        phone: req.body.phone,
        createdDate: new Date()
    };
    reservationsCollection.findOneAndUpdate(
        { _id: new ObjectID(req.params.id) },
        { $set: insertObj }
    ).then((data) => {
        res.send(data.value)
    }).catch((e) => {
        res.send(e)
    });

}

exports.apiMakeReservation = (req, res) => {
    insertObj = {
        homeId: new ObjectID(req.params.id),
        resDates: req.body.dates,
        guest: req.body.guest,
        phone: req.body.phone,
        madeBy: req.body.madeBy,
        madeById: new ObjectID(req.body.madeById),
        createdDate: new Date(),
        cleaned: false,
        cleanedById: null,
        cleanedBy: null,
        cleanedDate: null
    }
    reservationsCollection.insertOne(insertObj)
        .then((info) => {
            returnObj = {
                _id: info.ops[0]._id,
                homeName: info.ops[0].homeName,
                madeBy:  info.ops[0].madeBy,
                madeFor: info.ops[0].guest,
                phone: info.ops[0].phone,
                start: info.ops[0].resDates.split('to')[0],
                end: info.ops[0].resDates.split('to')[1],
                cleaned: info.ops[0].cleaned,
                cleanedById: info.ops[0].cleanedById,
                cleanedBy: info.ops[0].cleanedBy,
                cleanedDate: info.ops[0].cleanedDate
            }
           res.send(returnObj)
    }).catch((e) => {
        res.send(e)
    })
}

exports.apiGetReservations = async (req, res) => {
    try {
        let resMatch = await reservationsCollection.aggregate(
            [ {$match: {homeId: new ObjectID(req.params.id)}},
                {$project: {
                    resDates: 1,
                    guest: 1,
                    phone: 1,
                    madeBy: 1,
                    cleaned: 1,
                    cleanedBy: 1,
                    cleanedById: 1,
                    cleanedDate: 1
                }},
                {$sort: {resDates: 1}}
            ]).toArray();
            if(resMatch.length) {
                res.send(resMatch)
            } else {
                res.send('none')
            }
    } catch(err) {
        res.status(404).send('error getting reservations')
    }
}

exports.apiDeleteReservation = (req, res) => {
    if(ObjectID.isValid(req.params.id)) {
        reservationsCollection.deleteOne({_id: new ObjectID(req.params.id)}).
        then(() => {
            res.send(req.params.id)
        }).catch((e) => {
            res.send('error')
        })
    }
}

exports.reservationCleaned = (req, res) => {
    let insertObj = {
        cleaned: true,
        cleanedBy: req.body.keeperName,
        cleanedById: new ObjectID(req.body.keeperId),
        cleanedDate: new Date()
    };
    
    reservationsCollection.findOneAndUpdate(
        { _id: new ObjectID(req.body.resId) },
        { $set: insertObj }
    ).then((data) => {
        if(data.value) {
            res.send({cleanedDate: new Date()})
        } else {
            res.send('error')
        }
    }).catch((e) => {
        res.send(e)
    });
   
}

