'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
    yyyymmdd: String,
    wakePlan: String,
    wakeLog: String,
    exercisePlan: String,
    exerciseLog: String,
    eatingPlan: String,
    eatingLog: String,
    readingPlan: String,
    readingLog: String,
    tasks: Object,
    gratuity: String,
    journal: String
});

module.exports = mongoose.model('Thing', ThingSchema);