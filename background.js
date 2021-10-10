var target = "https://farmrpg.com/worker.php?go=explore*"
var urlFilter = { urls: [target] }

var rawData;

function onError(error) {
    console.error(`Error: ${error}`);
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
function sendInventoryUpdate(tabs, newItems) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id,
            {
                items: newItems
            }
        ).catch(onError);
    }
}

async function handleExploreResponse(response) {
    var root = document.createElement('html')
    root.innerHTML = response
    var items = Array.from(root.getElementsByTagName('img'))
    console.log(items)
    var newItems = items.map(item => {
        return parseItemUrl(item.src)
    }).reduce((itemMap, item) => {
        let count = itemMap.get(item) || 0
        count += 1
        itemMap.set(item, count)
        return itemMap
    }, new Map())

    console.log(newItems)
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(tabs => sendInventoryUpdate(tabs, newItems)).catch(onError);
}

function parseItemUrl(itemUrl) {
    // Get filename
    let filename = itemUrl.split('\\').pop().split('/').pop();
    let itemId = filename.split('.').shift()
    let itemName = itemUrls[itemId]
    if (itemName == null) {
        console.log(itemId + " not added to list of items")
        return null
    }
    return itemName
}

let itemUrls = {
    "5908": "Straw",
    "mushroom": "Mushroom",
    "6067": "Bird Egg",
    "6143": "Wood",
    "5910": "Arrowhead",
    "5922": "Antler",
    "5986": "Hide",
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
var onHeaderReceivedlistener = function (result) {
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();
    if (result.method === "POST") {
        let filter = browser.webRequest.filterResponseData(result.requestId);

        filter.ondata = event => {
            let str = decoder.decode(event.data, { stream: true });
            handleExploreResponse(str)
            filter.write(encoder.encode(str))
        }
        filter.onstop = event => {
            filter.close();
        }
    }
}
browser.webRequest.onHeadersReceived.addListener(
    onHeaderReceivedlistener,
    urlFilter,
    ["blocking"]
);

console.log("background running")