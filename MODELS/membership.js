const { default: mongoose } = require("mongoose");

const MembershipSchema = mongoose.Schema({
    months: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gym",
        required: true,
    },
},{timestamps:true});

const modelMembership = mongoose.model("membership", MembershipSchema);

module.exports = modelMembership;