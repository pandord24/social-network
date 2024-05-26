const { Schema, Types } = require("mongoose");
const dateformat = require("../utils/dateFormat");


const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()

        },
        reactionBody: {
            type:String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: dateformat.now,
            get: timestamp => dateformat(timestamp)
        }
    },
    {
        toJSON: {
            getters: true,

        },
        id: false
    }
);


module.exports = reactionSchema;