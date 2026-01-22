import type { IChatAdapter } from './IChatAdapter';

export class GeminiAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        // Try to get title from H1 which is usually the chat title
        const h1 = document.querySelector('h1.title'); // Hypothetical class, but h1 is usually standard
        if (h1 && h1.textContent) return h1.textContent.trim();

        // Fallback to document title, stripping "Gemini - " if present
        const docTitle = document.title;
        if (docTitle) {
            return docTitle.replace(/^Gemini/, '').replace(/ - Google$/, '').trim();
        }

        return "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('gemini.google.com');
    }
}
