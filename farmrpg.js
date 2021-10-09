document.body.style.border = "5px solid red"
var maxInventory = "880"

function restoreInventory() {
    localStorage.setItem('space crstal', 1)

    var root = document.createElement("div")
    document.getElementsByClassName('page-content')[0].appendChild(root)
    root.style.padding = "16px 16px 16px 16px"


    root.append(title())
    root.append(updateInventoryButton())
    root.append(inventory())
}

function title() {
    var title = document.createTextNode("Contextual Inventory")
    var div = document.createElement("div")
    div.style.fontSize = "x-large"
    div.style.paddingBottom = "8px"
    div.appendChild(title)
    return div
}

function updateInventoryButton() {
    var updateInventoryButton = document.createElement("button")
    updateInventoryButton.textContent = "Update Inventory"
    updateInventoryButton.setAttribute("margin", "4px 4px 4px 4px")
    updateInventoryButton.onclick = function(event) {
        updateInventoryCounts()
    }
    var div = document.createElement("div")
    div.style.paddingBottom = "8px"
    div.appendChild(updateInventoryButton)
    return div
}

function inventory() {
    var inventoryList = document.createElement("ul")
    inventoryList.appendChild(inventoryItem())
    return inventoryList
}

function inventoryItem() {
    var item = document.createElement("li")
    var itemCount = localStorage.getItem('crystal') + "/" + maxInventory
    item.appendChild(document.createTextNode("Crystal: " + itemCount))
    return item
}


function updateInventoryCounts() {
    var page = document.getElementsByClassName("page-on-center")[0]
    if (page.getAttribute("data-page") === "inventory") {
        var items = Array.from(page.getElementsByClassName("list-block")[0].getElementsByClassName("item-link"))
        // console.log(items.length + " items found")
        // console.log(items)
        items.forEach(item  => {
            var itemName = item.getElementsByClassName("item-title")[0].getElementsByTagName("strong")[0].textContent
            var itemCount = parseInt(item.getElementsByClassName("item-after")[0].textContent)
            // console.log(itemName + " " + itemCount)
            localStorage.setItem(itemName, itemCount)
        })
    } else {
        console.log("Not on inventory page")
    }
}

if (document.readyState !== 'loading') {
    restoreInventory()
} else {
    document.addEventListener('DOMContentLoaded', restoreInventory);
}

