// document.body.style.border = "5px solid red"
var maxInventory = 958
var navigationDelay = 1000
let lastExploreExplore = 2

var root

browser.runtime.onMessage.addListener(request => {
    if (request.event === "refreshContext") {
        setTimeout(updateContextualInventory, navigationDelay)
    } else if (request.event === "updateLastExplore") {
        lastExploreExplore = request.exploreId
    } else if (request.event === "updateInventory") {
        if (request.items != null) {
            request.items.forEach((count, item) => {
                let amount = parseInt(localStorage.getItem(item))
                localStorage.setItem(item, Math.min(amount + count, maxInventory))
            })
            updateContextualInventory()
        }
    }
});

function updateContextualInventory() {
    console.log("Updating Contextual Inventory...")

    let mainView = document.getElementsByClassName("view-main")[0]
    maybeRemoveExistingItemList()

    // Handle pets
    let petsView = mainView.getElementsByClassName("page-on-center")[0]
    if (petsView != null && petsView.getAttribute("data-page") === "pet") {
        let petImage = petsView.getElementsByTagName('a')[0]
        let petId = new URLSearchParams(new URL(petImage.href).search).get("id")
        root.append(inventory(pets[petId]))
        return
    }

    // Otherwise go through explore flow
    var navbar = mainView.getElementsByClassName("navbar-on-center")[0]
    if (navbar != null) {
        var location = navbar.getElementsByClassName("center")[0].childNodes[0].textContent.trim()
        var itemList = explores[location]
        if (itemList != null && root != null) {
            root.append(inventory(itemList))
        } else {
            // console.log("No items or cannot find contextual inventory section")
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
        alert("Inventory counts updated")
        maybeRemoveExistingItemList()
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
    var itemCount = parseInt(localStorage.getItem(itemName)) || 0
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
    localStorage.clear()
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
    if (root == null) {
        root = document.createElement("div")
        document.getElementsByClassName('page-content')[0].appendChild(root)
        root.style.padding = "16px 16px 16px 16px"
    }

    root.append(title())
    root.append(updateInventoryButton())
}

function showGoToLastExplore() {
    if (root == null) {
        root = document.createElement("div")
        document.getElementsByClassName('page-content')[0].appendChild(root)
    }

    let exploreUrlPrefix = new URL("https://farmrpg.com/#!/area.php")
    let queryParam = new URLSearchParams({ 'id': lastExploreExplore })
    let exploreUrl = exploreUrlPrefix.toString() + "?" + queryParam.toString()

    var exploreLastLocationButton = document.createElement("button")
    exploreLastLocationButton.textContent = "Explore Last Location"

    exploreLastLocationButton.onclick = function (event) {
        window.location.href = exploreUrl
    }
    var div = document.createElement("div")
    div.style.paddingBottom = "8px"
    div.appendChild(exploreLastLocationButton)
    root.append(div)
}

function init() {
    showGoToLastExplore()
    restoreInventory()
}

if (document.readyState !== 'loading') {
    init()
} else {
    document.addEventListener('DOMContentLoaded', init);
}

let pets = {
    // Cat
    "1": [
    ],

    // Dog
    "2": [
    ],

    // Squirrel
    "3": [
    ],

    // Owl
    "4": [
        "Apple",
        "Orange",
        "Lemon",
        "Hide",
        "Eggs",
        "Bird Egg",
        "Grapes",
        "Honey"
    ],

    // Boar
    "5": [
    ],

    // Snake
    "6": [
    ],

    // Baboon
    "7": [
        "Corn",
        "Glass Bottle",
        "Sturdy Shield",
        "Shimmer Topaz",
        "Lemonade",
        "Bone Fish",
        "Cotton",
        "Gold Eggplant"
    ],

    // Hedgehog
    "8": [
        "Cabbage",
        "Explosive",
        "Straw",
        "Cheese",
        "Orange Juice",
        "Twine",
        "Gold Cucumber",
        "Broccoli"
    ],

    // Spider
    "9": [
    ],

    // Frog
    "10": [
    ],

    // Penguin
    "11": [
    ]
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

let smallcave = [
    "Bone",
    "Grab Bag 02",
    "Model Ship",
    "Mushroom",
    "Nails",
    "Runestone 04",
    "Stone",
    "Wood",
    "Wooden Mask",
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

let mistyforest = [
    "3-leaf Clover",
    "4-leaf Clover",
    "Acorn",
    "Amber",
    "Blue Feathers",
    "Fern Leaf",
    "Gold Feather",
    "Mushroom",
    "Pine Cone",
    "Runestone 05",
    "Shiny Beetle",
    "Spider",
    "Straw",
    "Sweet Root",
    "Unpolished Ruby",
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

let blackrockcanyon = [
    "Ancient Coin",
    "Coal",
    "Giant Centipede",
    "Horn",
    "Medium Chest 02",
    "Large Chest 02",
    "Runestone 09",
    "Runestone 13",
    "Sandstone",
    "Shimmer Quartz"
]

let emberlagoon = [
    "Ancient Coin",
    "Diamond",
    "Emberstone",
    "Glass Orb",
    "Large Chest 01",
    "Magicite",
    "Moonstone",
    "Prism Shard",
    "Runestone 17",
    "Stone"
]

var explores = {
    "Forest": forest,
    "Small Cave": smallcave,
    "Cane Pole Ridge": canepoleridge,
    "Misty Forest": mistyforest,
    "Mount Banon": mtbanon,
    "Ember Lagoon": emberlagoon,
    "Black Rock Canyon": blackrockcanyon
}
