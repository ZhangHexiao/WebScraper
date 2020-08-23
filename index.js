const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
// const Listing = require("./model/Listing");

const jobScraped = [
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
    for (let positionIndex = 0; positionIndex <= 50; positionIndex = positionIndex + 10) {
    await page.goto(
        "https://ca.indeed.com/jobs?q=web+developer&l=Toronto,+ON&start" + positionIndex
    );
    const html = await page.content();
    const $ = cheerio.load(html);
    const listings = $(".jobsearch-SerpJobCard")
      .map((index, element) => {
        const companyElement = $(element).find(".company").text().trim();
        const locationElement = $(element).find(".location").text().trim();
        const remoteOrOfficeElement = $(element).find(".remote").text().trim();
        const compensationElement = $(element).find(".salaryText").text().trim();
        const requirementElement = $(element).find(".jobCardReqItem").text().trim();
        const summaryElement = $(element).find(".summary").text().trim();
        const postTimeElement = $(element).find(".date").text().trim();
        const titleElement = $(element).find(".title")
          .text()
          .replace("new", "")
          .trim();
        return { titleElement, companyElement, locationElement, remoteOrOfficeElement,
            compensationElement, requirementElement, summaryElement, postTimeElement};
      })
      .get();
    await sleep(100); //0.1 second sleep
    return listings;
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
    // console.log(listings);
  }
  
  main();

