const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = []; // full list stored here

// Render movie list
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt(${movie.id}, '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;

        movieListDiv.appendChild(movieElement);
    });
}

// Fetch all movies (READ)
function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies;
            renderMovies(allMovies);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

fetchMovies(); // initial load

// Search functionality
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {
        return (
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm)
        );
    });

    renderMovies(filteredMovies);
});

// Add new movie (POST)
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add movie');
            return response.json();
        })
        .then(() => {
            form.reset();
            fetchMovies();
        })
        .catch(error => console.error('Error adding movie:', error));
});

// Edit movie (prompt)
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYear = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYear && newGenre) {
        updateMovie(id, {
            id: id,
            title: newTitle,
            year: parseInt(newYear),
            genre: newGenre
        });
    }
}

// Update movie (PUT)
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update movie');
            return response.json();
        })
        .then(() => {
            fetchMovies();
        })
        .catch(error => console.error('Error updating movie:', error));
}

// Delete movie (DELETE)
function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete movie');
            fetchMovies();
        })
        .catch(error => console.error('Error deleting movie:', error));
}
