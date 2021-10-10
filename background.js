var target = "https://farmrpg.com/worker.php?go=explore*"
var urlFilter = { urls: [target] }
let contextualInventoryFilter = {
    urls: [
        "https://farmrpg.com/area.php*",
        "https://farmrpg.com/pet.php*"
    ]
}

let exploreFilter = {
    urls: [
        "https://farmrpg.com/worker.php?go=explore*"
    ]
}


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
                event: "updateInventory",
                items: newItems
            }
        ).catch(onError);
    }
}

async function handleExploreResponse(response) {
    var root = document.createElement('html')
    root.innerHTML = response
    var items = Array.from(root.getElementsByTagName('img'))
    var newItems = items.map(item => {
        return parseItemUrl(item.src)
    }).reduce((itemMap, item) => {
        let count = itemMap.get(item) || 0
        count += 1
        itemMap.set(item, count)
        return itemMap
    }, new Map())

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
    "5798": "Lemon Quartz",
    "5782": "Unpolished Shimmer Stone",
    "5779": "Iron",
    "6174": "Stone",
    "hbeetle": "Horned Beetle",
    "4887": "Pocket Watch",
    "fireant": "Fire Ant",
    "5996": "Gold Feather",
    "8774": "Gold Leaf",
    "5759": "Acorn",
    "5992": "Unpolished Ruby",
    "5963": "Blue Feathers",
    "fern": "Fern Leaf",
    "8250": "3-leaf Clover",
    "5685": "Sweet Root",
    "pinecone2": "Pine Cone",
    "spider_t_01": "Spider",
    "fourleaf": "4-leaf Clover",
    "beetle": "Shiny Beetle",
    "rs5": "Runestone 05",
    "8166": "Emberstone",
    "8072": "Prism Shard",
    "6019": "Ancient Coin",
    "5708": "Glass Orb",
    "7963": "Magicite",
    "8014": "Moonstone",
    "coal": "Coal",
    "5197": "Sandstone",
    "6111": "Horn",
    "5707": "Shimmer Quartz",
    "giantcent": "Giant Centipede",
    "8572": "Large Chest 02",
    "rs13": "Runestone 13",
    "rs9": "Runestone 09",
    "5860": "Nail",
    "6033": "Bone",
    "4497": "Grab Bag 02",
    "rs4": "Runestone 04",
    "4880": "Wooden Mask"


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
    exploreFilter,
    ["blocking"]
);

browser.webRequest.onCompleted.addListener(
    responseDetails => {
        let exploreId = new URLSearchParams(new URL(responseDetails.url).search).get('id')
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then(tabs => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                    tab.id,
                    {
                        event: "updateLastExplore",
                        exploreId: exploreId
                    }
                ).catch(onError);
            }
        }).catch(onError);

    },
    exploreFilter
)

browser.webRequest.onCompleted.addListener(
    responseDetails => {
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then(tabs => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                    tab.id,
                    {
                        event: "refreshContext"
                    }
                ).catch(onError);
            }
        }).catch(onError);
    },
    contextualInventoryFilter
)
