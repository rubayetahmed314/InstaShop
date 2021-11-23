const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            // Working with Relationship
            type: ObjectId,
            ref: "Category",
            required: true,
        },
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        shipping: {
            required: false,
            type: Boolean,
        },
        rating: {
            required: false,
            type: Array,
        },
        avg_rating: {
            required: false,
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
