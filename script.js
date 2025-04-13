// Replace this with your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Replace with your actual API key from Firebase
    authDomain: "wnnss.firebaseapp.com",
    databaseURL: "https://wnnss-4b028-default-rtdb.firebaseio.com/",
    projectId: "wnnss",
    storageBucket: "wnnss.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID", // Replace with your actual Messaging Sender ID
    appId: "YOUR_APP_ID" // Replace with your actual App ID
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
        const mediaType = mediaElement
            ? (mediaElement.tagName.toLowerCase() === "img" ? "image" : "video")
            : null;

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

// Mod mode and other functions remain unchanged
// See previous response for the rest of the script
