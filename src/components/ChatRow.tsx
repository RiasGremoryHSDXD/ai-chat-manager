import React from 'react';
import { MessageSquare, Pin } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { ActionMenu } from './ActionMenu';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface ChatRowProps {
    chatId: string;
    dragId?: string;
}

export const ChatRow: React.FC<ChatRowProps> = ({ chatId, dragId }) => {
    const chat = useFolderStore((state) => state.chats[chatId]);
    const deleteItem = useFolderStore((state) => state.deleteItem);
    const renameItem = useFolderStore((state) => state.renameItem);
    const toggleChatPin = useFolderStore((state) => state.toggleChatPin);
    const addTag = useFolderStore((state) => state.addTag);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: dragId || chatId,
        data: {
            type: 'chat',
            title: chat?.title,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
    };

    if (!chat) return null;

    const handleOpen = () => {
        if (!isDragging) {
            window.open(chat.url, '_blank');
        }
    };

    const handleDelete = () => {
        if (confirm(`Delete chat "${chat.title}"?`)) {
            deleteItem(chatId, false);
        }
    };

    const handleRename = () => {
        const newName = prompt("Rename chat:", chat.title);
        if (newName?.trim()) {
            renameItem(chatId, newName.trim(), false);
        }
    };

    const handleTogglePin = () => {
        toggleChatPin(chatId);
    };

    const handleAddTag = () => {
        const tag = prompt("Enter tag name:");
        if (tag?.trim()) {
            addTag(chatId, tag.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="flex items-center group py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-grab active:cursor-grabbing ml-4 transition-colors touch-none"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm truncate text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                        {chat.title}
                    </span>
                    {chat.pinned && <Pin size={12} className="text-orange-500 rotate-45" />}
                </div>
                {chat.tags && chat.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {chat.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center">
                <ActionMenu
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onTogglePin={handleTogglePin}
                    onAddTag={handleAddTag}
                    isPinned={chat.pinned}
                />
            </div>
        </div>
    );
};
