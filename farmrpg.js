document.body.style.border = "5px solid red"
var maxInventory = "880"
var navigationDelay = 1000

var root

function getUpdatedContextualInventory() {
    var navbar = document.getElementsByClassName("view-main")[0].getElementsByClassName("navbar-on-center")[0]
    if (navbar != null) {
        var location = navbar.getElementsByClassName("center")[0].childNodes[0].textContent.trim()
        var itemList = explores[location]
        if (itemList != null && root != null) {
            var existingList = root.getElementsByTagName("ul")
            if (existingList != null && existingList.length > 0) {
                console.log("removing existing list")
                root.removeChild(existingList)
            }
            console.log(
                "appending"
            )
            root.append(inventory())

        } else {
            console.log("No items or cannot find contextual inventory section")
        }
    } else {
        console.log("Not on valid page")
    }
    return []
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

function inventory() {
    var inventoryList = document.createElement("ul")
    inventoryList.id = "contextual-item-list"
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
        items.forEach(item => {
            var itemName = item.getElementsByClassName("item-title")[0].getElementsByTagName("strong")[0].textContent
            var itemCount = parseInt(item.getElementsByClassName("item-after")[0].textContent)
            // console.log(itemName + " " + itemCount)
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
    setTimeout(function () {
        root.append(getUpdatedContextualInventory())
    }, navigationDelay)
}

function registerUpdateContextualInventoryListener() {
    document.addEventListener('click', function (event) {
        console.log("updating inventory")
        // Wait for navigation to happen before updating inventory
        setTimeout(
            getUpdatedContextualInventory, navigationDelay
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