import { Schema } from 'mongoose';


export const SpawnSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    location: {
        lon: Number,
        lat: Number,
    },
    yokai: {
        type: Schema.Types.ObjectId,
        ref: 'Yokai',
        required: true,
    },
});
