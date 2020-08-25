const mongoose = require("mongoose");

const jobScrapedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      company: String,
      location: String,
      remoteOrOffice: String,
      compensation: String,
      requirement: String,
      summary: String,
      postTime: String,
      tag: String,
      hided : {
        type: Boolean,
        default: false
    }  
},{
    timestamps: true
  },);

const JobScraped = mongoose.model("JobScraped", jobScrapedSchema);

module.exports = JobScraped;