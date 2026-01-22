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
