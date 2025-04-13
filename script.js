const GITHUB_TOKEN = "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"; // Replace this token immediately after testing
const REPO_OWNER = "asadfsko"; // Your GitHub username
const REPO_NAME = "your-repository-name"; // Your repository name
const FILE_PATH = "index.html"; // File to update in the repository
const BRANCH = "main"; // Branch to update

// Save changes and push to GitHub
async function saveChanges() {
    const newsContainer = document.getElementById("news-container");
    const newsHTML = newsContainer.innerHTML;

    try {
        // Get the current file content SHA
        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (!fileResponse.ok) {
            throw new Error("Failed to fetch file from GitHub.");
        }

        const fileData = await fileResponse.json();
        const sha = fileData.sha;

        // Prepare updated file content
        const updatedContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WNSS Stupidity</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <h1>WNSS Stupidity</h1>
        <p>Your daily dose of absurdity and news!</p>
        <button class="mod-button" onclick="openModLogin()">Mod</button>
    </header>
    <main id="news-container" class="main-content">
        ${newsHTML}
    </main>
    <footer class="footer">
        <p>&copy; 2025 WNSS Stupidity. All rights reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
`;

        // Base64 encode the updated content
        const base64Content = btoa(unescape(encodeURIComponent(updatedContent)));

        // Update the file on GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Update news content",
                content: base64Content,
                sha: sha,
                branch: BRANCH,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update file on GitHub.");
        }

        alert("Changes saved and updated on GitHub successfully!");
    } catch (error) {
        console.error(error);
        alert("An error occurred while saving changes.");
    }
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
