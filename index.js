const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const JobScraped = require("./model/JobScraped");

const jobScrapedResult = [
    {
      title: "Front End Web Developer",
      company: "Deskree Studio",
      location: "Tonronto, ON",
      remoteOrOffice: "Remote",
      compensation: "$60000-$80000 a year",
      requirement: "Front end development: 3 years",
      summary: "Work on development and delivery of Front-End parts for various web applications including administrative panels, internal systems, as well as a variety of…",
      postTime: "1 day ago"
    }
  ];

  async function connectToMongoDb() {
    await mongoose.connect(
      "mongodb+srv://Hexiao:ReactTest@jobinfor.r2hn1.mongodb.net/jobInfor?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    );
    console.log("connected to mongodb");
  }

async function scrapeListings(page) {
    for (let positionIndex = 0; positionIndex <= 20; positionIndex = positionIndex + 10) {
    await page.goto(
        "https://ca.indeed.com/jobs?q=web+developer&l=Toronto,+ON&start" + positionIndex
    );
    const html = await page.content();
    const $ = cheerio.load(html);
    const listings = $(".jobsearch-SerpJobCard")
      .map((index, element) => {
        const company = $(element).find(".company").text().trim();
        const location = $(element).find(".location").text().trim();
        const remoteOrOffice = $(element).find(".remote").text().trim();
        const compensation = $(element).find(".salaryText").text().trim();
        const requirement = $(element).find(".jobCardReqItem").text().trim();
        const summary = $(element).find(".summary").text().trim();
        const postTime = $(element).find(".date").text().trim();
        const title = $(element).find(".title")
          .text()
          .replace("new", "")
          .trim();
        const jobJustScraped =  { title, company, location, remoteOrOffice,
          compensation, requirement, summary, postTime }; 
        // const jobScrapedModel = new JobScraped(jobJustScraped); 
        // jobScrapedModel.save();
        return jobJustScraped;
      })
      .get();
    
    await sleep(100); //0.1 second sleep
    return listings;
    }
  }

  async function saveScrapeJobs(listings) {
    for (var i = 0; i < listings.length; i++) {
      const jobModel = new JobScraped(listings[i]);
      await jobModel.save();
    }
  }
  async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  }

  async function main() {
    await connectToMongoDb();
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    const listings = await scrapeListings(page);
    const scrapeJobDescriptions = await saveScrapeJobs(listings);
    // console.log(listings);
  }
  
  main();

