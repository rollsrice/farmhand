var target = "https://farmrpg.com/worker.php?go=explore*"
var urlFilter = { urls: [target] }

var rawData;

function handleExploreResponse(response) {
    console.log(response)
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
var onHeaderReceivedlistener = function (result) {
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();
    if (result.method === "POST") {
        let filter = browser.webRequest.filterResponseData(result.requestId);

        filter.ondata = event => {
            let str = decoder.decode(event.data, {stream: true});
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