// for my one true love, Kyle

// environment variables
require('dotenv').config()
// website loading
const axios = require("axios");
// reading html
const cheerio = require("cheerio")
// texting service
const accountSid = process.env.SID
const authToken = process.env.TOKEN
const client = require('twilio')(accountSid, authToken);

// testing with my cellphone
// const userPhoneNumber = "8027774849"

// Kyle's cellphone
const userPhoneNumber = "8027936498"


main()

async function main() {

    // one time use for initial notification of tracking
    // notifyUserEnrolled()

    // check Best Buy
    await checkBestBuy()
    await checkAmazon()
}


async function checkBestBuy() {

    let bestBuyURL = "https://www.bestbuy.com/site/lg-gram-2-in-1-14-touch-screen-laptop-intel-core-i7-16gb-memory-1tb-ssd-dark-silver/6398013.p?skuId=6398013"
    let bestBuyHtml = await loadHTML(bestBuyURL)
    
    // creates metaphor for accessing DOM
    const $ = cheerio.load(bestBuyHtml)

    // product button state (either disabled or not disabled)
    let comingSoonButtonText = $(".fulfillment-add-to-cart-button button").text()

    // notify condition
    if (comingSoonButtonText != "Coming Soon") {
        let productName = $(".sku-title").text().trim()
        let location = "Best Buy"
        notifyAvailability(location, productName, bestBuyURL)
    }
}

async function checkAmazon() {
    
    let amazonURL = "https://www.amazon.com/dp/B083CCRR5W"
    let returnedHTML = await loadHTML(amazonURL)
    // creates metaphor for accessing DOM
    const $ = cheerio.load(returnedHTML)

    // locates availability status
    let unavailableElement = $("#availability").children().first()
    // gets text value and trims whitespace chars
    unavailableElement = unavailableElement.text().trim()


    // notify condition
    if (unavailableElement != "Currently unavailable.") {
        let productName = $("#productTitle").text().trim()
        let location = "Amazon"
        notifyAvailability(location, productName, amazonURL)
    }

}


async function loadHTML(url) {
    // use axios to load Best Buy page
    try {
        let response = await axios.get(url);
        HTML = response.data
        return HTML
    } catch (error) {
        console.error(error);
    }
}



function notifyAvailability(location, productName, productURL) {


    // send text
    client.messages
        .create({
            body: `Now available at ${location}:\n${productName}\n\nYou can buy it here: ${productURL}`,
            from: '+18022103669',
            to: `+1${userPhoneNumber}`
        })
}

function notifyUserEnrolled() {

    // send text
    client.messages
        .create({
            body: `Howdy doody, we're now checking Amazon and Best Buy every five minutes for availability of the LG Gram.\n\nHere's a link to the repo for this code: https://bit.ly/31SwJNa`,
            from: '+18022103669',
            to: `+1${userPhoneNumber}`
        })
}