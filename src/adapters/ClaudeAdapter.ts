import type { IChatAdapter } from './IChatAdapter';

export class ClaudeAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        // Claude usually puts the title in the document title: "Title - Claude"
        const docTitle = document.title;
        if (docTitle) {
            return docTitle.replace(/ - Claude$/, '').trim();
        }
        return "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('claude.ai');
    }
}
