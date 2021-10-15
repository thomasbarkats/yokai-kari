import moment from 'moment';
import { Schema } from 'mongoose';
import { CaptureSchema } from './capture.schema';
import { SpawnSchema } from './spawn.schema';


export const UserSchema: Schema = new Schema({
    date: {
        type: Date,
        default: moment.utc().toDate()
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        match: /^[a-z0-9]([a-z0-9.-]+)[a-z0-9]$/
    },
    password: {
        type: String,
        required: true
    },
    authKey: String,
    tempCode: {
        hash: String,
        date: Date
    },
    '2FA': Boolean,
    location: {
        lon: Number,
        lat: Number,
    },
    bestiary: [CaptureSchema],
    spawns: [SpawnSchema]
});
