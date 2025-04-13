const PASSWORD = "Salle134";

// Open the mod login modal
function openModLogin() {
    document.getElementById("mod-login-modal").style.display = "flex";
}

// Close the mod login modal
function closeModLogin() {
    document.getElementById("mod-login-modal").style.display = "none";
    document.getElementById("error-message").textContent = "";
    document.getElementById("mod-password").value = "";
}

// Verify the password
function verifyPassword() {
    const inputPassword = document.getElementById("mod-password").value;
    if (inputPassword === PASSWORD) {
        enterModMode();
        closeModLogin();
    } else {
        document.getElementById("error-message").textContent = "Incorrect password. Try again.";
    }
}

// Enter mod mode
function enterModMode() {
    const newsItems = document.querySelectorAll(".news-item");
    newsItems.forEach((item) => {
        item.setAttribute("contenteditable", "true");
        item.style.border = "2px dashed #1e90ff"; // Indicate editable mode
    });
    document.getElementById("save-button").hidden = false;
    document.getElementById("create-news-button").hidden = false;
}

// Save changes
function saveChanges() {
    const newsContainer = document.getElementById("news-container");
    const newsHTML = newsContainer.innerHTML;

    // Save changes to localStorage (or send to server if needed)
    localStorage.setItem("newsContent", newsHTML);

    // Exit mod mode
    const newsItems = document.querySelectorAll(".news-item");
    newsItems.forEach((item) => {
        item.setAttribute("contenteditable", "false");
        item.style.border = "1px solid #1e90ff"; // Reset border
    });
    document.getElementById("save-button").hidden = true;
    document.getElementById("create-news-button").hidden = true;

    alert("Changes saved successfully!");
}

// Load saved changes on page load
window.onload = () => {
    const savedNews = localStorage.getItem("newsContent");
    if (savedNews) {
        document.getElementById("news-container").innerHTML = savedNews;
    }
};

// Open the Create News modal
function openCreateNews() {
    document.getElementById("create-news-modal").style.display = "flex";
}

// Close the Create News modal
function closeCreateNews() {
    document.getElementById("create-news-modal").style.display = "none";
    document.getElementById("news-title").value = "";
    document.getElementById("news-description").value = "";
    document.getElementById("news-media").value = "";
}

// Add a new news item
function addNews() {
    const title = document.getElementById("news-title").value;
    const description = document.getElementById("news-description").value;
    const media = document.getElementById("news-media").files[0];

    if (!title || !description) {
        alert("Please fill in both the title and description.");
        return;
    }

    const newsContainer = document.getElementById("news-container");

    const newsItem = document.createElement("section");
    newsItem.className = "news-item";
    newsItem.setAttribute("contenteditable", "true");
    newsItem.style.border = "2px dashed #1e90ff";

    const newsTitle = document.createElement("h2");
    newsTitle.textContent = title;

    const newsDescription = document.createElement("p");
    newsDescription.textContent = description;

    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDescription);

    if (media) {
        const mediaElement = media.type.startsWith("image/")
            ? document.createElement("img")
            : document.createElement("video");
        mediaElement.src = URL.createObjectURL(media);
        mediaElement.controls = true;
        mediaElement.style.maxWidth = "100%";
        mediaElement.style.marginTop = "10px";
        newsItem.appendChild(mediaElement);
    }

    newsContainer.appendChild(newsItem);
    closeCreateNews();
}
