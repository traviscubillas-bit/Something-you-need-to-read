function initializeQuoteGenerator() {
    const configurations = [
        {
            buttonId: "new-quote",
            quoteId: "quote",
            authorId: "author",
            statusId: "status",
            welcomeId: "quote-welcome"
        }
    ];
    const config = configurations.find(({ buttonId }) =>
        document.getElementById(buttonId)
    );

    if (!config) {
        return;
    }

    const { buttonId, quoteId, authorId, statusId, welcomeId } = config;
    const button = document.getElementById(buttonId);
    const quote = document.getElementById(quoteId);
    const author = document.getElementById(authorId);
    const status = document.getElementById(statusId);
    const welcome = welcomeId
        ? document.getElementById(welcomeId)
        : null;

    if (!button || !quote || !author || !status) {
        return;
    }

    let hasGeneratedQuote = false;

    button.addEventListener("click", async () => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 15000);

        button.disabled = true;
        status.textContent = "Finding a quote...";

        try {
            const response = await fetch(
                "https://dummyjson.com/quotes/random",
                { signal: controller.signal }
            );

            if (!response.ok) {
                throw new Error(
                    `Quote request failed with status ${response.status}.`
                );
            }

            const data = await response.json();
            if (
                !data ||
                typeof data.quote !== "string" ||
                typeof data.author !== "string" ||
                !data.quote.trim() ||
                !data.author.trim()
            ) {
                throw new Error("The quote API returned invalid data.");
            }

            quote.textContent = `“${data.quote.trim()}”`;
            author.textContent = `— ${data.author.trim()}`;
            author.hidden = false;
            if (welcome) {
                welcome.hidden = true;
            }

            hasGeneratedQuote = true;
            button.textContent = "Another Quote";
            status.textContent = "";
        } catch (error) {
            console.error("Unable to load quote:", error);
            status.textContent = error.name === "AbortError"
                ? "The quote request timed out. Please try again."
                : "We couldn’t load a quote. Check your connection and try again.";
        } finally {
            window.clearTimeout(timeoutId);
            button.disabled = false;
            if (!hasGeneratedQuote) {
                button.textContent = "Generate First Quote";
            }
        }
    });
}

initializeQuoteGenerator();
