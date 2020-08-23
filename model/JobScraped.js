const mongoose = require("mongoose");

const jobScrapedSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    remoteOrOffice: String,
    compensation: String,
    requirement: String,
    summary: String,
    postTime: String
});

const JobScraped = mongoose.model("JobScraped", jobScrapedSchema);

module.exports = JobScraped;