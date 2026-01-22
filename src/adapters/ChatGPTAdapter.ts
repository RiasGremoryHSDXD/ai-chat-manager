import type { IChatAdapter } from './IChatAdapter';

export class ChatGPTAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        // ChatGPT sticky header title often in specific elements
        // Try generic selectors first as classes change dynamically

        // Look for the title in the conversation header
        // This is highly dependent on ChatGPT's current DOM structure
        // A common pattern is an h1 or encoded classes

        // Attempt 1: Look for an element usually containing the title in the top bar
        // This is a guess-work without inspecting live site, but sticky header implies top bar
        const titleElement = document.querySelector('div[data-testid="conversation-title"]');
        if (titleElement && titleElement.textContent) return titleElement.textContent.trim();

        // Attempt 2: Document title
        const docTitle = document.title;
        if (docTitle) {
            return docTitle.replace(/ChatGPT/, '').trim();
        }

        return "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('chatgpt.com');
    }
}
