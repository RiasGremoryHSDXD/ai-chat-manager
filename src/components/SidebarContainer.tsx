import React, { useState } from 'react';
import { FolderPlus, Save, Settings, Moon, Sun } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { FolderTree } from './FolderTree';
import { useTheme } from '../context/ThemeContext';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export const SidebarContainer: React.FC = () => {
    const rootFolderIds = useFolderStore((state) => state.rootFolderIds);
    const addFolder = useFolderStore((state) => state.addFolder);
    const saveChat = useFolderStore((state) => state.saveChat);
    const moveItem = useFolderStore((state) => state.moveItem);
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleAddRootFolder = () => {
        const name = prompt("New Folder Name:");
        if (name) addFolder(name);
    };

    const toggleTheme = () => {
        if (theme === 'dark') setTheme('light');
        else setTheme('dark');
    };

    const getThemeIcon = () => {
        if (theme === 'light') return <Sun size={18} />;
        return <Moon size={18} />;
    };

    const handleSaveCurrentChat = async () => {
        setError(null);
        setLoading(true);

        // Check if we can access the active tab
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.id) {
                setError("No active tab found.");
                setLoading(false);
                return;
            }

            // Send message to content script
            chrome.tabs.sendMessage(tab.id, { action: 'SCRAPE_METADATA' }, (response) => {
                setLoading(false);
                if (chrome.runtime.lastError) {
                    setError("Could not connect to page. Refresh the page or ensure it's Gemini/ChatGPT.");
                    return;
                }

                if (response?.success) {
                    saveChat(response.data);
                } else {
                    setError(response?.error || "Failed to save chat.");
                }
            });

        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Unexpected error.");
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Check if dropping a chat (active) into a folder (over)
            // We need to ensure active is a chat and over is a folder
            // or we lean on moveItem to handle logic?
            // SidebarContainer only knows IDs.
            // Let's pass the move command.
            // Note: Our moveItem implementation in store might need to be robust.
            moveItem(active.id as string, over.id as string);
        }
        setActiveId(null);
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900 w-full text-gray-800 dark:text-gray-100 transition-colors duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors duration-200">
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">AI Folders</span>
                </h1>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
                        title="Toggle Theme"
                    >
                        {getThemeIcon()}
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 transition-colors">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <button
                    onClick={handleSaveCurrentChat}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Chat'}
                </button>
                <button
                    onClick={handleAddRootFolder}
                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                >
                    <FolderPlus size={16} /> New Folder
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-2 text-center border-b border-red-100 dark:border-red-900/50">
                    {error}
                </div>
            )}

            {/* Content */}
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex-1 overflow-y-auto p-2">
                    {rootFolderIds.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <p className="mb-2">No folders yet.</p>
                            <p className="text-sm">Create one or save a chat!</p>
                        </div>
                    ) : (
                        rootFolderIds.map(id => (
                            <FolderTree key={id} folderId={id} />
                        ))
                    )}
                </div>
                <DragOverlay>
                    {activeId ? (
                        // Render a visual representation of what's being dragged
                        // We can try to reuse ChatRow or a simplified version
                        <div className="p-2 bg-white dark:bg-gray-800 shadow-lg rounded border border-blue-500 opacity-90 w-48 truncate pointer-events-none">
                            Dragging Item...
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
