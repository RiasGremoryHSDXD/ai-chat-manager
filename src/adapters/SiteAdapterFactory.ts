import type { IChatAdapter } from './IChatAdapter';
import { GeminiAdapter } from './GeminiAdapter';
import { ChatGPTAdapter } from './ChatGPTAdapter';

export class SiteAdapterFactory {
    static getAdapter(url: string): IChatAdapter | null {
        if (url.includes('gemini.google.com')) {
            return new GeminiAdapter();
        } else if (url.includes('chatgpt.com')) {
            return new ChatGPTAdapter();
        }
        return null;
    }
}
