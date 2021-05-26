const mongoose = require('mongoose');
const User = require('./UserModel.js');

/* 
    The long url obviously points to the online MongoAtlas database,
    but it is recommended to run the MongoDB locally so that the website 
    can run faster if running locally
*/

const url = "mongodb+srv://tongki:02esdHZiY!@cluster0.emw09.mongodb.net/chirperDB?retryWrites=true&w=majority";
//const url = 'mongodb://localhost:27017/chirperDB';

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const database = {

    /*
        connects to database
    */
    connect: function () {
        mongoose.connect(url, options, function(error) {
            if(error) throw error;
            console.log('Connected to: ' + url);
            
        });
    },

    insertOne: function(model, doc, callback) {
        model.create(doc, function(error, result) {
            if(error) return callback(false);
            console.log('Added ' + result);
            return callback(true);
        });
    },

    insertMany: function(model, docs) {
        model.insertMany(docs, function(error, result) {
            if(error) return callback(false);
            console.log('Added ' + result);
            return callback(true);
        });
    },

    findOne: function(model, query, projection, callback) {
        model.findOne(query, projection, function(error, result) {
            if(error) return callback(false);
            return callback(result);
        });
    },

    findOnePopulate: function(model, query, projection, path, callback){
        model.findOne(query, projection).populate(path).lean().exec(function(err, result){
            if(err) return callback(err);
            return callback(result);
        });
    },

    findMany: function(model, query, projection, callback) {
        model.find(query, projection).lean().exec(function(error, result) {
            if(error) return callback(false);
            return callback(result);
        });
    },

    findManyPopulate: function(model, query, projection, path, sort, callback){
        model.find(query, projection).populate(path).sort(sort).lean().exec(function(err, result){
            if(err) return callback(false);
            
            return callback(result);
        });
    },

    updateOne: function(model, filter, update, callback) {
        model.updateOne(filter, update, function(error, result) {
            if(error) return callback(false);
            console.log('Document modified: ' + result.nModified);
            return callback(true);
        });
    },

    updateMany: function(model, filter, update, callback) {
        model.updateMany(filter, update, function(error, result) {
            if(error) return callback(false);
            console.log('Documents modified: ' + result.nModified);
            return callback(true);
        });
    },

    deleteOne: function(model, conditions, callback) {
        model.deleteOne(conditions, function (error, result) {
            if(error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
        });
    },

    deleteMany: function(model, conditions, callback) {
        model.deleteMany(conditions, function (error, result) {
            if(error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
        });
    },

}

module.exports=database;