document.body.style.border = "5px solid red"
var maxInventory = 890
var navigationDelay = 1000

var root

function updateContextualInventory() {
    var navbar = document.getElementsByClassName("view-main")[0].getElementsByClassName("navbar-on-center")[0]
    maybeRemoveExistingItemList()
    if (navbar != null) {
        var location = navbar.getElementsByClassName("center")[0].childNodes[0].textContent.trim()
        var itemList = explores[location]
        if (itemList != null && root != null) {
            root.append(inventory(itemList))
        } else {
            console.log("No items or cannot find contextual inventory section")
        }
    } else {
        console.log("Not on valid page")
    }
}

function maybeRemoveExistingItemList() {
    var existingList = root.getElementsByTagName("ul")[0]
    if (existingList != null) {
        root.removeChild(existingList)
    }
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
    updateInventoryButton.onclick = function (event) {
        updateInventoryCounts()
    }
    var div = document.createElement("div")
    div.style.paddingBottom = "8px"
    div.appendChild(updateInventoryButton)
    return div
}

function inventory(items) {
    var inventoryList = document.createElement("ul")

    items.forEach(item => {
        inventoryList.appendChild(inventoryItem(item))
    })

    return inventoryList
}

function inventoryItem(itemName) {
    var itemNode = document.createElement("li")
    var itemCount = parseInt(localStorage.getItem(itemName))
    var itemFraction = itemCount + "/" + maxInventory
    itemNode.appendChild(document.createTextNode(itemName + ": " + itemFraction))
    itemNode.style.color = inventoryFractionToColor(itemCount)
    return itemNode
}

function inventoryFractionToColor(itemCount) {
    color = "White"
    if (itemCount / maxInventory >= 0.5) {
        color = "LightSalmon"
    }
    if (itemCount === maxInventory) {
        color = "Tomato"
    }
    return color
}

function updateInventoryCounts() {
    var page = document.getElementsByClassName("page-on-center")[0]
    if (page.getAttribute("data-page") === "inventory") {
        var items = Array.from(page.getElementsByClassName("list-block")[0].getElementsByClassName("item-link"))
        items.forEach(item => {
            var itemName = item.getElementsByClassName("item-title")[0].getElementsByTagName("strong")[0].textContent
            var itemCount = parseInt(item.getElementsByClassName("item-after")[0].textContent)
            localStorage.setItem(itemName, itemCount)
        })
    } else {
        console.log("Not on inventory page")
    }
}

function restoreInventory() {
    localStorage.setItem('space crstal', 1)

    if (root == null) {
        root = document.createElement("div")
    }
    document.getElementsByClassName('page-content')[0].appendChild(root)
    root.style.padding = "16px 16px 16px 16px"

    root.append(title())
    root.append(updateInventoryButton())

    // Wait for navigation to happen before updating inventory
    setTimeout(function () {
        updateContextualInventory()
    }, navigationDelay)
}

function registerUpdateContextualInventoryListener() {
    document.addEventListener('click', function (event) {
        // Wait for navigation to happen before updating inventory
        setTimeout(
            updateContextualInventory, navigationDelay
        )
    })
}

function init() {
    restoreInventory()
    registerUpdateContextualInventoryListener()
}

if (document.readyState !== 'loading') {
    init()
} else {
    document.addEventListener('DOMContentLoaded', init);
}

var forest = [
    "Antler",
    "Arrowhead",
    "Bird Egg",
    "Fire Ant",
    "Gold Feather",
    "Gold Leaf",
    "Hide",
    "Mushroom",
    "Straw",
    "Wood"
]

var canepoleridge = [
    "Horned Beetle",
    "Iron",
    "Lemon Quartz",
    "Lima Bean",
    "Mushroom",
    "Pocket Watch",
    "Stone",
    "Unpolished Shimmer Stone",
    "Wood"
]

var mtbanon = [
    "Bacon",
    "Carbon Sphere",
    "Coal",
    "Gold Feather",
    "Iron",
    "Magna Quartz",
    "Runestone 19",
    "Small Chest 02",
    "Stone",
    "Unpolished Emerald",
    "Unpolished Shimmer Stone"
]

var explores = {
    "Forest": forest,
    "Cane Pole Ridge": canepoleridge,
    "Mount Banon": mtbanon,
}