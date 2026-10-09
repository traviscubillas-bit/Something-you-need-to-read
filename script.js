
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const button = document.getElementById("new-quote");
const statusElement = document.getElementById("status");
const music = document.getElementById("background-music");

async function getQuote() {
    button.disabled = true;

    if (music.paused) {
        music.play().catch((error) => {
            console.error("Could not play music:", error);
        });
    }

    try {
        const quoteResponse = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        if (!quoteResponse.ok) {
            throw new Error("Could not load quote.");
        }
        const quoteData = await quoteResponse.json();

        if (
            typeof quoteData.quote !== "string" ||
            typeof quoteData.author !== "string" ||
            !quoteData.quote.trim() ||
            !quoteData.author.trim()
        ) {
            throw new Error("The quote service returned invalid data.");
        }

        quoteElement.textContent = quoteData.quote;
        authorElement.textContent = "— " + quoteData.author;

        const imageUrl =
            "https://picsum.photos/1200/800?random=" + Date.now();

        document.body.style.backgroundImage =
            `linear-gradient(rgba(15,23,42,0.55),` +
            `rgba(15,23,42,0.55)),` +
            `url("${imageUrl}")`;

        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";

        statusElement.textContent = "";

    } catch (error) {
        console.error("Error:", error);

        statusElement.textContent =
            "Could not fetch data. Please try again.";

    } finally {
        button.disabled = false;
    }
}

button.addEventListener("click", getQuote);
