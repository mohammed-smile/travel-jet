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
const resultsSection = document.querySelector("#results-section");
const heroEl = document.querySelector(".hero")
const contactForm = document.querySelector(".contact-form")
const featured = document.querySelector("#featured");


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
        countries: input.search(/\bcountr(y|ies)|\bcit(y|ies)\b/)
    }

    matches = Object.entries(matches)
        .filter(entry => entry[1] != -1)
        .sort((a, b) => a[1] - b[1])
        .map((entry) => entry[0]);

    heroEl.classList.add("hidden");
    featured.classList.add("hidden");
    resultsSection.classList.remove("hidden")

    let resultsHTML = matches.length ?
        "<h1>Search results</h1><div id=\"results-grid\">" :
        '<h1>No results found</h1><p>Try "Beaches", "Temples", or "Countries".';
    for (match of matches) {
        let recoms = travelData[match];

        for (recom of recoms) {
            if (match == "countries") {
                for (city of recom.cities) {
                    resultsHTML += `
                        <div class="results-card">
                            <img src="images/${city.imageUrl}" alt="${city.name} photo">
                            <h2>${city.name}</h2>
                            <p>${city.description}</p>
                        </div>
                    `
                }
            } else {
                resultsHTML += `
                <div class="results-card">
                    <img src="images/${recom.imageUrl}" alt="${recom.name} photo">
                    <h2>${recom.name}</h2>
                    <p>${recom.description}</p>
                </div>
            `
            }
        }
    }
    resultsSection.innerHTML = resultsHTML
}

function clear() {
    if (searchInput) searchInput.value = "";
    if (resultsSection) resultsSection.innerHTML = "";
    if (heroEl) heroEl.classList.remove("hidden");
    if (featured) featured.classList.remove("hidden");
    if (resultsSection) resultsSection.classList.add("hidden");
}

function input(e) {
    if (e.key == "Enter") search();
}

function submit(e) {
    e.preventDefault();
    const confimation = document.querySelector("#form-confirmation");
    if (confimation) confimation.classList.remove('hidden');
    contactForm.reset();
    document.documentElement.scrollTo(0, 0);
}