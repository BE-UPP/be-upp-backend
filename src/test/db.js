
/**
 * https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
 module.exports.connect = async () => {
    await mongoose.connection.close();
    await mongod.start();
    const uri = mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
        poolSize: 10
    };

    await mongoose.connect(uri, mongooseOpts);
}


/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    try{
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
    catch (error) {
        console.log(error)
    }
}