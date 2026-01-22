console.log('Background service worker loaded');

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Chat Manager extension installed');
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'OPEN_SIDE_PANEL') {
        const tabId = sender.tab?.id;
        if (tabId) {
             // Requires Chrome 116+ and user gesture in content script (which we have via click)
             // However, chrome.sidePanel.open options requires windowId, not tabId usually for global, 
             // but specific tab opening is:
             chrome.sidePanel.open({ tabId, windowId: sender.tab?.windowId })
               .catch((error) => console.error("Failed to open side panel:", error));
        }
    }
});
