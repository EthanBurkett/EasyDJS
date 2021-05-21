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
            /*create: (data) => {
                if (data.subCollection) {
                    Client.dbModels.set(data.name, {
                        collection: data.collection,
                        subCollection: data.subCollection,
                        merge: data.merge ? data.merge : true
                    })
                } else {
                    Client.dbModels.set(data.name, {
                        collection: data.collection,
                        merge: data.merge ? data.merge : true
                    })
                }
            },
            get: ({ modelName, done }) => {
                
                if (!Client.dbModels.get(modelName)) {
                    console.log(`Database model ${modelName} not found. Exiting process.`)
                    process.exit()
                }

                const model = Client.dbModels.get(modelName)

                if(model.subCollection) {
                    Database.collection(model.collection.name).doc(model.collection.value).collection(model.subCollection.name).doc(data.subCollection.value).get().then(snap => {
                        return done(snap);
                    })
                } else {
                    Database.collection(model.collection.name).doc(model.collection.value).get().then(snap => {
                        return done(snap);
                    })
                }
            },
            set: (modelName, data) => {
                if (!Client.dbModels.get(modelName)) {
                    console.log(`Database model ${modelName} not found. Exiting process.`)
                    process.exit()
                }
                
                const model = Client.dbModels.get(modelName)

                if(model.subCollection) {
                    if(!data.subCollection) {
                        console.log(`This model requires a subcollection to be set. Exiting process to prevent further errors.`)
                        process.exit()
                        return
                    }

                    Database.collection(model.collection.name).doc(model.collection.value).collection(model.subCollection.name).doc(data.subCollection.value).set(data)
                }
            }*/
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