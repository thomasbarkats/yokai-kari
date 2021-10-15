import { Schema } from 'mongoose';


export const YokaiSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    occurrence: {
        type: Number,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});
