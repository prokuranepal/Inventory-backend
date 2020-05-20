const mongoose = require("mongoose");
const userInfo = require("./users");
const medicineInfo = require("./medicines");


const healthpostschema = new mongoose.Schema({

    name:{
        type:String,
        required : true
    },
    location:{
        type: String,
        required: true
    },

    employee  : {

    type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
},
    medicine:{
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
       
    },

    gpslocation :{'type': {
        type: String,
        required: true,
        enum: ['Point', 'LineString', 'Polygon'],
        default: 'Point'
      },
      coordinates: [Number],
      select: false
    }



})

module.exports = mongoose.model('healthpostschema',healthpostschema);