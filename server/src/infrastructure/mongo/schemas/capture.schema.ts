import { Schema } from 'mongoose';


export const CaptureSchema: Schema = new Schema({
    yokai: {
        type: Schema.Types.ObjectId,
        ref: 'Yokai',
        required: true,
    },
    number: {
        type: Number,
        default: 0,
    },
    dates: [Date],
    locations: [{
        lon: Number,
        lat: Number,
    }],
});
