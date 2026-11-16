let myResearch = []
const cropEl = document.getElementById("crop-el")
const methodEl = document.getElementById("method-el")
const categoryEl = document.getElementById("category-el")
const noteEl = document.getElementById("note-el")
const urlEl = document.getElementById("url-el")
const inputBtn = document.getElementById("input-btn")
const tabBtn = document.getElementById("tab-btn")
const deleteBtn = document.getElementById("delete-btn")
const ulEl = document.getElementById("ul-el")
const researchFromLocalStorage = JSON.parse(localStorage.getItem("myResearch"))

if (researchFromLocalStorage) {
    myResearch = researchFromLocalStorage
    render(myResearch)
}

function render(research) {
    ulEl.innerHTML = ""
    for (let i = 0; i < research.length; i++) {
        const item = document.createElement("li")
        const heading = document.createElement("strong")
        heading.textContent = research[i].crop + " - " + research[i].method + " - " + research[i].category
        const note = document.createElement("p")
        note.textContent = research[i].note
        const link = document.createElement("a")
        link.href = research[i].url
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.textContent = research[i].url.replace(/^https?:\/\//, "")
        item.appendChild(heading)
        item.appendChild(note)
        item.appendChild(link)
        ulEl.appendChild(item)
    }
}

inputBtn.addEventListener("click", function() {
    const crop = cropEl.value.trim()
    const method = methodEl.value
    const category = categoryEl.value.trim()
    const note = noteEl.value.trim()
    let url = urlEl.value.trim()

    if (!crop || !method || !category || !note || !url) {
        alert("Please fill in all the fields")
        return
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
    }
    try {
        const website = new URL(url)
        if (!website.hostname.includes(".")) throw new Error("Invalid URL")
    } catch (error) {
        alert("Please enter a valid website URL")
        return
    }

    myResearch.push({crop: crop, method: method, category: category, note: note, url: url})
    localStorage.setItem("myResearch", JSON.stringify(myResearch))
    render(myResearch)
    cropEl.value = ""
    methodEl.value = ""
    categoryEl.value = ""
    noteEl.value = ""
    urlEl.value = ""
})

tabBtn.addEventListener("click", function() {
    if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url) urlEl.value = tabs[0].url
        })
    } else {
        urlEl.value = window.location.href
    }
})

deleteBtn.addEventListener("dblclick", function() {
    localStorage.removeItem("myResearch")
    myResearch = []
    render(myResearch)
})
