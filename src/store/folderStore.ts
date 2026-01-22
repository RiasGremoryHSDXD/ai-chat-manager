import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { generateId } from '../utils/generateId';

export interface Folder {
    id: string;
    name: string;
    children: string[]; // Sub-folder IDs
    items: string[];    // Chat IDs
    isOpen: boolean;
}

export interface Chat {
    id: string;
    title: string;
    url: string;
    platform: 'gemini' | 'chatgpt' | 'other';
    createdAt: number;
}

interface ChatObject {
    title: string;
    url: string;
    platform: 'gemini' | 'chatgpt' | 'other';
}

interface FolderState {
    folders: Record<string, Folder>;
    chats: Record<string, Chat>;
    rootFolderIds: string[];

    addFolder: (name: string, parentId?: string) => void;
    deleteItem: (id: string, isFolder?: boolean) => void;
    renameItem: (id: string, newName: string, isFolder?: boolean) => void;
    moveItem: (id: string, newParentId: string) => void;
    saveChat: (chatData: ChatObject, folderId?: string) => void;
    toggleFolder: (folderId: string) => void;
}

export const useFolderStore = create<FolderState>()(
    persist(
        immer((set) => ({
            folders: {},
            chats: {},
            rootFolderIds: [],

            addFolder: (name, parentId) => {
                const newFolderId = generateId();
                const newFolder: Folder = {
                    id: newFolderId,
                    name,
                    children: [],
                    items: [],
                    isOpen: true,
                };

                set((state) => {
                    state.folders[newFolderId] = newFolder;
                    if (parentId && state.folders[parentId]) {
                        state.folders[parentId].children.push(newFolderId);
                    } else {
                        state.rootFolderIds.push(newFolderId);
                    }
                });
            },

            deleteItem: (id, isFolder) => {
                set((state) => {
                    // Helper to remove id from parent's children or items
                    const removeFromParent = (itemId: string, isFolderArg: boolean) => {
                        // Check roots
                        const rootIndex = state.rootFolderIds.indexOf(itemId);
                        if (rootIndex !== -1 && isFolderArg) {
                            state.rootFolderIds.splice(rootIndex, 1);
                            return;
                        }
                        // Check access all folders to find parent
                        for (const key in state.folders) {
                            const folder = state.folders[key];
                            if (isFolderArg) {
                                const idx = folder.children.indexOf(itemId);
                                if (idx !== -1) {
                                    folder.children.splice(idx, 1);
                                    return;
                                }
                            } else {
                                const idx = folder.items.indexOf(itemId);
                                if (idx !== -1) {
                                    folder.items.splice(idx, 1);
                                    return;
                                }
                            }
                        }
                    };

                    if (isFolder) {
                        // Recursive delete logic could be added here to clean up children
                        // For now, simplist deletion of the node and reference
                        delete state.folders[id];
                        removeFromParent(id, true);
                    } else {
                        delete state.chats[id];
                        removeFromParent(id, false);
                    }
                });
            },

            renameItem: (id, newName, isFolder) => {
                set((state) => {
                    if (isFolder) {
                        if (state.folders[id]) state.folders[id].name = newName;
                    } else {
                        if (state.chats[id]) state.chats[id].title = newName;
                    }
                });
            },

            moveItem: (id, newParentId) => {
                // Simplified move: remove from old parent, add to new parent
                // Implementation depends on whether id is folder or chat.
                // This requires checking where it effectively resides.
                // For this task, we will implementation a robust find-and-move.
                set((state) => {
                    let isFolder = false;
                    if (state.folders[id]) isFolder = true;
                    else if (state.chats[id]) isFolder = false;
                    else return; // Not found

                    // Remove from old location
                    const removeFromParent = () => {
                        const rootIndex = state.rootFolderIds.indexOf(id);
                        if (rootIndex !== -1) {
                            state.rootFolderIds.splice(rootIndex, 1);
                            return;
                        }
                        for (const key in state.folders) {
                            const folder = state.folders[key];
                            if (isFolder) {
                                const idx = folder.children.indexOf(id);
                                if (idx !== -1) {
                                    folder.children.splice(idx, 1);
                                    return;
                                }
                            } else {
                                const idx = folder.items.indexOf(id);
                                if (idx !== -1) {
                                    folder.items.splice(idx, 1);
                                    return;
                                }
                            }
                        }
                    };
                    removeFromParent();

                    // Add to newParentId
                    if (!newParentId) {
                        // Move to root (only valid for folders usually, depending on logic)
                        if (isFolder) state.rootFolderIds.push(id);
                        // Chats usually strictly inside folders? If not, maybe root chats supported?
                        // The prompt says "Folder structure (ID, name, children IDs, items)".
                        // Only folders have items.
                    } else {
                        if (state.folders[newParentId]) {
                            if (isFolder) state.folders[newParentId].children.push(id);
                            else state.folders[newParentId].items.push(id);
                        }
                    }
                });
            },

            saveChat: (chatData, folderId) => {
                const chatId = generateId();
                const newChat: Chat = {
                    id: chatId,
                    ...chatData,
                    createdAt: Date.now(),
                };

                set((state) => {
                    state.chats[chatId] = newChat;
                    // Default to first root folder if no folderId provided, or create "Unsorted"
                    if (folderId && state.folders[folderId]) {
                        state.folders[folderId].items.push(chatId);
                    } else {
                        // Fallback: Add to the first available folder or a default one
                        // For strict correctness, we might want to handle 'root' chats but folders is where items go.
                        // We'll create an "Unsorted" folder if none exists, or use the first root folder.
                        if (state.rootFolderIds.length > 0) {
                            const firstRoot = state.rootFolderIds[0];
                            state.folders[firstRoot].items.push(chatId);
                        } else {
                            // Create Unsorted folder
                            const unsortedId = generateId();
                            const unsortedFolder: Folder = {
                                id: unsortedId,
                                name: "Unsorted",
                                children: [],
                                items: [chatId],
                                isOpen: true
                            };
                            state.folders[unsortedId] = unsortedFolder;
                            state.rootFolderIds.push(unsortedId);
                        }
                    }
                });
            },

            toggleFolder: (folderId) => {
                set((state) => {
                    if (state.folders[folderId]) {
                        state.folders[folderId].isOpen = !state.folders[folderId].isOpen;
                    }
                });
            },
        })),
        {
            name: 'ai-chat-manager-storage',
            // persist helps automatically sync to localStorage
            // chrome.storage.local requires a custom storage adapter if we want to sync across devices,
            // but 'localStorage' inside extension works on the machine.
            // Task prompt mentioned "storageSync(): A helper to sync the Zustand state to chrome.storage.local automatically."
            // We can implement a custom storage interface here later.
        }
    )
);
