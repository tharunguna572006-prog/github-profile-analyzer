const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const resultContainer = document.getElementById('result-container');
const profileCard = document.getElementById('profile-card');
const reposList = document.getElementById('repos-list');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (!username) return;

    // Reset UI
    showLoading();
    hideResult();
    hideError();

    try {
        const userData = await fetchUserData(username);
        const userRepos = await fetchUserRepos(username);

        displayProfile(userData);
        displayRepos(userRepos);
        
        hideLoading();
        showResult();
    } catch (error) {
        console.error(error);
        hideLoading();
        showError();
    }
});

async function fetchUserData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error('User not found');
    }
    return response.json();
}

async function fetchUserRepos(username) {
    // Fetch 5 most recently updated repositories
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    if (!response.ok) {
        throw new Error('Could not fetch repos');
    }
    return response.json();
}

function displayProfile(data) {
    profileCard.innerHTML = `
        <img src="${data.avatar_url}" alt="${data.name}" class="avatar">
        <h2 class="user-name">${data.name || data.login}</h2>
        <p class="user-bio">${data.bio || 'No bio available'}</p>
        <div class="stats">
            <div class="stat-item">
                <span class="stat-value">${data.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${data.following}</span>
                <span class="stat-label">Following</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${data.public_repos}</span>
                <span class="stat-label">Repos</span>
            </div>
        </div>
    `;
}

function displayRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
        reposList.innerHTML = '<p>No public repositories found.</p>';
        return;
    }

    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.className = 'repo-item';
        repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank" class="repo-link">${repo.name}</a>
            <p class="repo-desc">${repo.description || 'No description provided'}</p>
        `;
        reposList.appendChild(repoItem);
    });
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showResult() {
    resultContainer.classList.remove('hidden');
}

function hideResult() {
    resultContainer.classList.add('hidden');
}

function showError() {
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}
