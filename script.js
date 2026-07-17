// بسم الله الرحمن الرحيم

// Load data
let travelData;
fetch("travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => travelData = data);


// Get elements
const searchInput = document.querySelector("#search-input");;
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector("#clear-btn");
const resultsEl = document.querySelector("#results");
const heroEl = document.querySelector(".hero")
const contactForm = document.querySelector(".contact-form")


// Bind listeners
if (searchBtn) searchBtn.addEventListener("click", search);
if (clearBtn) clearBtn.addEventListener("click", clear);
if (searchInput) searchInput.addEventListener("keydown", input);
if (contactForm) contactForm.addEventListener("submit", submit);


// Define callbacks
function search() {
    let input = searchInput.value;
    if (!input) return;

    let matches = {
        beaches: input.search(/\bbeach(es)?\b/i),
        temples: input.search(/\btemples?\b/),
        countries: input.search(/\bcountr(y|ies)\b/)
    }

    matches = Object.entries(matches)
        .filter(entry => entry[1] != -1)
        .sort((a, b) => a[1] - b[1])
        .map((entry) => entry[0]);

    heroEl.classList.add("hidden");

    resultsEl.innerHTML = matches.length ?
        "<h1>Search results</h1>" :
        '<h1>No results found</h1><p>Try "Beaches", "Temples", or "Countries".';
    for (match of matches) {
        let recoms = travelData[match];

        for (recom of recoms) {
            imageUrl = match == "counties" ?
                recom.cities[Math.floor(Math.random() * 100) % 2].imageUrl :
                recom.imageUrl;

            resultsEl.innerHTML += `
                <div class="results-card">
                    <h3>${recom.name}</h3>
                    <p>${recom.description}</p>
                    <img src="${imageUrl}" alt="${recom.name} photo">
                </div>
            `
        }
    }
}

function clear() {
    if (searchInput) searchInput.value = "";
    if (resultsEl) resultsEl.innerHTML = "";
    if (heroEl) heroEl.classList.remove("hidden");
}

function input(e) {
    if (e.Key == "Enter") search();
}

function submit(e) {
    e.preventDefault();
    const confimation = document.querySelector("#form-confirmation");
    if (confimation) confimation.classList.remove('hidden');
    contactForm.reset();
    document.documentElement.scrollTo(0, 0);
}