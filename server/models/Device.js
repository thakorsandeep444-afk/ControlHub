const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    deviceId: String,

    name: String,

    os: String,

    release: String,

    socketId: String,

    status: String,

    lastSeen: Date

});

module.exports = mongoose.model("Device", DeviceSchema);