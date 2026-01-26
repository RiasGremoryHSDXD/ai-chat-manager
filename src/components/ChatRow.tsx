import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { ActionMenu } from './ActionMenu';

interface ChatRowProps {
    chatId: string;
}

export const ChatRow: React.FC<ChatRowProps> = ({ chatId }) => {
    const chat = useFolderStore((state) => state.chats[chatId]);
    const deleteItem = useFolderStore((state) => state.deleteItem);
    const renameItem = useFolderStore((state) => state.renameItem);

    if (!chat) return null;

    const handleOpen = () => {
        window.open(chat.url, '_blank');
    };

    const handleDelete = () => {
        if (confirm(`Delete chat "${chat.title}"?`)) {
            deleteItem(chatId, false);
        }
    };

    const handleRename = () => {
        const newName = prompt("Rename chat:", chat.title);
        if (newName && newName.trim()) {
            renameItem(chatId, newName.trim(), false);
        }
    };

    return (
        <div className="flex items-center group py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer ml-4 transition-colors">
            <div className="flex-1 flex items-center gap-2 min-w-0" onClick={handleOpen}>
                <MessageSquare size={14} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm truncate text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {chat.title}
                </span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center">
                {/* <button onClick={handleOpen} className="p-1 hover:bg-gray-200 rounded">
            <ExternalLink size={14} className="text-gray-400" />
        </button> */}
                <ActionMenu onRename={handleRename} onDelete={handleDelete} />
            </div>
        </div>
    );
};
