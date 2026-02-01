import type { IChatAdapter } from './IChatAdapter';
import { GeminiAdapter } from './GeminiAdapter';
import { ChatGPTAdapter } from './ChatGPTAdapter';
import { ClaudeAdapter } from './ClaudeAdapter';
import { DeepSeekAdapter } from './DeepSeekAdapter';
import { PerplexityAdapter } from './PerplexityAdapter';
import { HuggingChatAdapter } from './HuggingChatAdapter';

export class SiteAdapterFactory {
    static getAdapter(url: string): IChatAdapter | null {
        if (url.includes('gemini.google.com')) {
            return new GeminiAdapter();
        } else if (url.includes('chatgpt.com')) {
            return new ChatGPTAdapter();
        } else if (url.includes('claude.ai')) {
            return new ClaudeAdapter();
        } else if (url.includes('deepseek.com')) {
            return new DeepSeekAdapter();
        } else if (url.includes('perplexity.ai')) {
            return new PerplexityAdapter();
        } else if (url.includes('huggingface.co/chat')) {
            return new HuggingChatAdapter();
        }
        return null;
    }
}
