const request = require("request-promise");
const cheerio = require("cheerio");

async function scrape(){
    for (let positionIndex = 0; positionIndex <= 50; positionIndex = positionIndex + 10){
        const html = await request.get(
            "https://ca.indeed.com/jobs?q=web+developer&l=Toronto,+ON&start" + positionIndex
        );
        const $ = await cheerio.load(html);
        $(".company").each((index, element) => {
            console.log($(element).text());
        });
            console.log("At page number" + positionIndex);
    }
}

scrape();