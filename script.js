const apiURL = "http://localhost:3000/movies";

document.addEventListener("DOMContentLoaded", () => {
    loadMovies();

    document.getElementById("addMovieBtn").addEventListener("click", addMovie);
    document.getElementById("search").addEventListener("input", filterMovies);
});

// Load all movies
function loadMovies() {
    fetch(apiURL)
        .then(res => res.json())
        .then(data => displayMovies(data))
        .catch(err => console.error("Fetch error:", err));
}

// Add movie
function addMovie() {
    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;

    if (!title || !genre || !year) {
        alert("Fill all fields");
        return;
    }

    fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, year })
    }).then(() => {
        loadMovies();
        document.getElementById("title").value = "";
        document.getElementById("genre").value = "";
        document.getElementById("year").value = "";
    });
}

// Delete movie
function deleteMovie(id) {
    fetch(`${apiURL}/${id}`, { method: "DELETE" })
        .then(() => loadMovies())
        .catch(err => console.error("Error deleting movie:", err));
}

// Show movie cards
function displayMovies(movies) {
    const container = document.getElementById("movieList");
    container.innerHTML = "";

    movies.forEach(movie => {
        container.innerHTML += `
            <div class="movie-item">
                <h3>${movie.title}</h3>
                <p><b>Genre:</b> ${movie.genre}</p>
                <p><b>Year:</b> ${movie.year}</p>
                <button onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        `;
    });
}

function filterMovies() {
    const query = document.getElementById("search").value.toLowerCase();

    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(m =>
                m.title.toLowerCase().includes(query) ||
                m.genre.toLowerCase().includes(query)
            );
            displayMovies(filtered);
        });
}
