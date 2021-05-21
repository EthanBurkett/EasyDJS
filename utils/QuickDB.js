const { Client } = require('../index')

module.exports = (Database) => {
    return {
        get: (data) => {
            if (data.subCollection) {
                Database.collection(data.collection.name).doc(data.collection.value).collection(data.subCollection.name).doc(data.subCollection.value).get().then(snap => {
                    return data.done(snap)
                })
            } else {
                Database.collection(data.collection.name).doc(data.collection.value).get().then(snap => {
                    return data.done(snap)
                })
            }
        },
        set: (data) => {
            if (data.subCollection) {
                Database.collection(data.collection.name).doc(data.collection.value).collection(data.subCollection.name).doc(data.subCollection.value).set(data.set, {
                    merge: data.merge ? data.merge : true
                })
            } else {
                Database.collection(data.collection.name).doc(data.collection.value).set(data.set, {
                    merge: data.merge ? data.merge : true
                })
            }
        },
        model: {
            create: (modelName, data, merge) => {
                Database.collection("models").doc(modelName).set(data, { merge: merge ? merge: true})
            },
            set: (modelName, data, merge) => {
                Database.collection("models").doc(modelName).get().then(model => {
                    if(model.data().subCollection) {
                        Database.collection(model.data().collection.name).doc(model.data().collection.value).collection(model.data().subCollection.name).doc(model.data().subCollection.value).set(data, { merge: merge ? merge: true})
                    } else {
                        Database.collection(model.data().collection.name).doc(model.data().collection.value).set(data, { merge: merge ? merge: true})
                    }
                    
                })
            },
            get: (modelName, done) => {
                Database.collection("models").doc(modelName).get().then(model => {

                    if(model.data().subCollection) {
                        Database.collection(model.data().collection.name).doc(model.data().collection.value).collection(model.data().subCollection.name).doc(model.data().subCollection.value).get().then(doc => {
                            return done(doc)
                        })
                    } else {
                        Database.collection(model.data().collection.name).doc(model.data().collection.value).get().then(doc => {
                            return done(doc)
                        })
                    }
                    
                })
            } 
        },

    }
}
