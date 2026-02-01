import type { IChatAdapter } from './IChatAdapter';

export class DeepSeekAdapter implements IChatAdapter {
    getChatTitle(): string | null {
        const docTitle = document.title;
        if (docTitle) {
            // Adjust based on actual DeepSeek title format if known, otherwise generic cleanup
            return docTitle.replace(/DeepSeek -? /, '').trim();
        }
        return "New Chat";
    }

    getChatUrl(): string {
        return window.location.href;
    }

    isChatOpen(): boolean {
        return window.location.hostname.includes('deepseek.com');
    }
}
