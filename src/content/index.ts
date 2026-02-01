import { SiteAdapterFactory } from '../adapters/SiteAdapterFactory';

console.log('AI Chat Manager: Content script loaded');

// SVG for Folder Icon (simplified from Lucide)
const folderIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/>
</svg>
`;

// Inject Floating Button
const injectFloatingButton = () => {
    // Avoid duplicates
    if (document.getElementById('ai-chat-manager-fab')) return;

    const button = document.createElement('div');
    button.id = 'ai-chat-manager-fab';
    button.innerHTML = folderIconSvg;

    // Styling
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#4F46E5', // Indigo-600
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: '9999',
        color: 'white',
        transition: 'transform 0.2s',
    });

    // Hover effect
    button.onmouseover = () => button.style.transform = 'scale(1.1)';
    button.onmouseout = () => button.style.transform = 'scale(1)';

    // Click Handler
    button.onclick = () => {
        // Send message to open side panel
        chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
    };

    document.body.appendChild(button);
};

// Check if we should inject (only on main frame)
if (window.self === window.top) {
    injectFloatingButton();
}


chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'SCRAPE_METADATA') {
        try {
            const adapter = SiteAdapterFactory.getAdapter(window.location.href);
            if (adapter) {
                const title = adapter.getChatTitle() || 'Untitled Chat';
                const url = adapter.getChatUrl();
                // Determine platform based on class name or URL
                let platform = 'other';
                if (url.includes('gemini.google.com')) platform = 'gemini';
                else if (url.includes('chatgpt.com')) platform = 'chatgpt';
                else if (url.includes('claude.ai')) platform = 'claude';
                else if (url.includes('deepseek.com')) platform = 'deepseek';
                else if (url.includes('perplexity.ai')) platform = 'perplexity';
                else if (url.includes('huggingface.co/chat')) platform = 'huggingchat';

                sendResponse({
                    success: true,
                    data: {
                        title,
                        url,
                        platform
                    }
                });
            } else {
                sendResponse({ success: false, error: 'Site not supported' });
            }
        } catch (error) {
            console.error('Error scraping metadata:', error);
            sendResponse({ success: false, error: 'Scraping failed' });
        }
    }
    return true; // Keep message channel open
});


// Handle Drag Start globally to capture links
document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    // Find closest anchor tag
    const link = target.closest('a');

    if (link && link.href) {
        // Basic filter for known chat URLs to avoid dragging random links causing saves
        // However, user might want to drag *any* link? The prompt says "drag the new chat".
        // Let's allow it but try to be smart about titles.

        let platform: 'gemini' | 'chatgpt' | 'claude' | 'deepseek' | 'perplexity' | 'huggingchat' | 'other' = 'other';
        if (link.href.includes('gemini.google.com')) platform = 'gemini';
        else if (link.href.includes('chatgpt.com')) platform = 'chatgpt';
        else if (link.href.includes('claude.ai')) platform = 'claude';
        else if (link.href.includes('deepseek.com')) platform = 'deepseek';
        else if (link.href.includes('perplexity.ai')) platform = 'perplexity';
        else if (link.href.includes('huggingface.co/chat')) platform = 'huggingchat';

        // Attempt to get a better title
        // In Gemini sidebar, the title is usually in a div/span inside the link
        let title = link.innerText || link.textContent || 'Untitled Chat';

        // Clean up title (remove newlines, extra spaces)
        title = title.replace(/\s+/g, ' ').trim();

        if (title.length > 50) title = title.substring(0, 50) + '...';

        const chatData = {
            title,
            url: link.href,
            platform,
            source: 'ai-chat-manager-drag' // Signature to verify on drop
        };

        // We use a custom MIME type or just standard json to identify our drop
        e.dataTransfer?.setData('application/json', JSON.stringify(chatData));
        // Also set text for debugging
        e.dataTransfer?.setData('text/plain', link.href);
    }
});
