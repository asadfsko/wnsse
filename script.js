// Replace this with your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://wnnss-4b028-default-rtdb.firebaseio.com/",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("news");

// Load news data from Firebase on page load
db.on("value", (snapshot) => {
    const newsData = snapshot.val();
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; // Clear existing content

    for (const id in newsData) {
        const newsItem = document.createElement("section");
        newsItem.className = "news-item";
        newsItem.setAttribute("contenteditable", "false");

        const newsTitle = document.createElement("h2");
        newsTitle.textContent = newsData[id].title;

        const newsDescription = document.createElement("p");
        newsDescription.textContent = newsData[id].description;

        newsItem.appendChild(newsTitle);
        newsItem.appendChild(newsDescription);

        if (newsData[id].mediaUrl) {
            const mediaElement = newsData[id].mediaType === "image"
                ? document.createElement("img")
                : document.createElement("video");
            mediaElement.src = newsData[id].mediaUrl;
            mediaElement.controls = true;
            mediaElement.style.maxWidth = "100%";
            mediaElement.style.marginTop = "10px";
            newsItem.appendChild(mediaElement);
        }

        newsContainer.appendChild(newsItem);
    }
});

// Save changes to Firebase
function saveChanges() {
    const newsContainer = document.getElementById("news-container");
    const newsItems = document.querySelectorAll(".news-item");

    const newsData = {};
    newsItems.forEach((item, index) => {
        const title = item.querySelector("h2").textContent;
        const description = item.querySelector("p").textContent;

        const mediaElement = item.querySelector("img, video");
        const mediaUrl = mediaElement ? mediaElement.src : null;
        const mediaType = mediaElement ? (mediaElement.tagName.toLowerCase() === "img" ? "image" : "video") : null;

        newsData[`news${index}`] = { title, description, mediaUrl, mediaType };
    });

    db.set(newsData, (error) => {
        if (error) {
            alert("Failed to save changes: " + error.message);
        } else {
            alert("Changes saved successfully!");
        }
    });
}

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
    if (inputPassword === "Salle134") {
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
