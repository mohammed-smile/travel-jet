// بسم الله الرحمن الرحيم

// Load data
let travelData;


// Get elements
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector("#clear-btn");
const resultsSection = document.querySelector("#results-section");
const heroEl = document.querySelector(".hero");
const contactForm = document.querySelector(".contact-form");
const featured = document.querySelector("#featured");
const searchForm = document.querySelector("#search-form");
const navToggle = document.querySelector('#nav-toggle');
const primaryNav = document.querySelector('#primary-nav');


// Initially disable search until data loads
if (searchBtn) searchBtn.disabled = true;
if (clearBtn) clearBtn.disabled = true;

// When data loads, enable buttons
fetch("travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
        travelData = data;
        if (searchBtn) searchBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;
    }).catch(() => {
        // leave buttons disabled on error
    });

// Bind listeners
if (searchForm) searchForm.addEventListener("submit", function (e) { e.preventDefault(); search(); });
if (clearBtn) clearBtn.addEventListener("click", clear);
if (contactForm) contactForm.addEventListener("submit", submit);
if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('show');
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navToggle.classList.toggle('active');
    });
}

// Ensure body class toggles to prevent background scroll when nav open
if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });
}

// Compute and set CSS variable for nav top offset so off-canvas menu sits below header
function setNavTopOffset() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const rect = navbar.getBoundingClientRect();
    const topOffset = Math.ceil(rect.height) + 'px';
    document.documentElement.style.setProperty('--nav-top', topOffset);
}

// Run on load and on resize to keep the offset accurate
setNavTopOffset();
window.addEventListener('resize', setNavTopOffset);


// Define callbacks
function search() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (!query) return;
    if (!travelData) {
        alert('Data is still loading, please try again in a moment.');
        return;
    }

    const matchesScore = {
        beaches: query.search(/\bbeach(es)?\b/i),
        temples: query.search(/\btemples?\b/i),
        countries: query.search(/\bcountr(y|ies)|\bcit(y|ies)\b/i)
    };

    const matches = Object.entries(matchesScore)
        .filter(([, v]) => v !== -1)
        .sort((a, b) => a[1] - b[1])
        .map((entry) => entry[0]);

    if (heroEl) heroEl.classList.add("hidden");
    if (featured) featured.classList.add("hidden");
    if (resultsSection) resultsSection.classList.remove("hidden");

    let resultsHTML = matches.length ? "<h1>Search results</h1><div id=\"results-grid\">" : '<h1>No results found</h1><p>Try "Beaches", "Temples", or "Countries".</p>';

    for (const match of matches) {
        const recoms = travelData[match] || [];

        for (const recom of recoms) {
            if (match === "countries") {
                for (const city of recom.cities || []) {
                    resultsHTML += `
                        <div class="results-card">
                            <img src="images/${city.imageUrl}" alt="${city.name} photo">
                            <h2>${city.name}</h2>
                            <p>${city.description}</p>
                        </div>
                    `;
                }
            } else {
                resultsHTML += `
                <div class="results-card">
                    <img src="images/${recom.imageUrl}" alt="${recom.name} photo">
                    <h2>${recom.name}</h2>
                    <p>${recom.description}</p>
                </div>
            `;
            }
        }
    }

    if (matches.length) resultsHTML += '</div>';
    if (resultsSection) resultsSection.innerHTML = resultsHTML;
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
    const confirmation = document.querySelector("#form-confirmation");
    if (confirmation) confirmation.classList.remove('hidden');
    if (contactForm) contactForm.reset();
    document.documentElement.scrollTo(0, 0);
}