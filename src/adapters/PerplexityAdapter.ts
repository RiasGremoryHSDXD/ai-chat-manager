import type { IChatAdapter } from './IChatAdapter';

export class PerplexityAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        // Perplexity often uses the query as title in document title
        const docTitle = document.title;
        return docTitle || "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('perplexity.ai');
    }
}
