function updateForm() {
    const type = document.getElementById('type').value;
    const authorLabel = document.getElementById('authorLabel');
    const pagesLabel = document.getElementById('pagesLabel');
    const progressLabel = document.getElementById('progressLabel');
    const coverOptions = document.getElementById('coverOptions');

    if (type === "reading") {
        authorLabel.style.display = "block";
        pagesLabel.style.display = "block";
        progressLabel.innerText = "How many pages have you read?";
        coverOptions.style.display = "block";
    } else {
        authorLabel.style.display = "none";
        pagesLabel.style.display = "none";
        progressLabel.innerText = "What episode are you on?";
        coverOptions.style.display = "none";
    }
}

async function fetchDetails() {
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;

    if (title.length < 3) return; 

    let apiUrl;
    if (type === "reading") {
        apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
    } else {
        apiUrl = `https://www.omdbapi.com/?apikey=YOUR_OMDB_API_KEY&s=${encodeURIComponent(title)}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (type === "reading" && data.docs.length > 0) {
            const book = data.docs[0]; 
            document.getElementById('author').value = book.author_name ? book.author_name.join(", ") : "Unknown";
            document.getElementById('pages').value = book.number_of_pages_median || "Unknown";
            document.getElementById('coverImage').src = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "";
            document.getElementById('bookUrl').value = `https://openlibrary.org${book.key}`;
        } else if (type === "watching" && data.Search && data.Search.length > 0) {
            const movie = data.Search[0];
            document.getElementById('coverImage').src = movie.Poster;
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}

function calculateProgress() {
    const pages = document.getElementById('pages').value;
    const progress = document.getElementById('progress').value;
    const progressPercentage = document.getElementById('progressPercentage');

    if (pages !== "Unknown" && pages > 0 && progress > 0) {
        let percent = Math.round((progress / pages) * 100);
        progressPercentage.innerText = `I'm ${percent}% through!`;
    } else {
        progressPercentage.innerText = "";
    }
}

function toggleCoverOption() {
    const choice = document.getElementById('coverChoice').value;
    document.getElementById('autoCover').style.display = choice === "auto" ? "block" : "none";
    document.getElementById('customCover').style.display = choice === "custom" ? "block" : "none";
    document.getElementById('bookLink').style.display = choice === "link" ? "block" : "none";
}

function previewCustomCover() {
    const file = document.getElementById('uploadCover').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('customCoverPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function generatePost() {
    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value;
    const progress = document.getElementById('progress').value;
    const thoughts = document.getElementById('thoughts').value;
    const rating = document.getElementById('rating').value;
    const progressText = document.getElementById('progressPercentage').innerText;
    const coverChoice = document.getElementById('coverChoice').value;
    let coverHTML = "";

    if (coverChoice === "auto") {
        coverHTML = `<img src="${document.getElementById('coverImage').src}" alt="Cover Image">`;
    } else if (coverChoice === "custom") {
        coverHTML = `<img src="${document.getElementById('customCoverPreview').src}" alt="Custom Cover">`;
    } else if (coverChoice === "link") {
        coverHTML = `<a href="${document.getElementById('bookUrl').value}" target="_blank">Find the book here</a>`;
    }

    document.getElementById('output').innerHTML = `
        <h2>Your Post</h2>
        <p><strong>${type === 'reading' ? '📖 Reading' : '🎬 Watching'}:</strong> ${title}</p>
        <p><strong>Progress:</strong> ${progressText}</p>
        <p><strong>Thoughts:</strong> ${thoughts}</p>
        <p><strong>Rating:</strong> ${rating} / 5</p>
        ${coverHTML}
    `;
}