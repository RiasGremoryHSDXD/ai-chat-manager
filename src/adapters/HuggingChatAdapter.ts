import type { IChatAdapter } from './IChatAdapter';

export class HuggingChatAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        const docTitle = document.title;
        if (docTitle) {
            return docTitle.replace(/ - HuggingChat$/, '').trim();
        }
        return "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('huggingface.co');
    }
}
