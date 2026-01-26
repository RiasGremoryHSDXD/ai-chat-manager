import React from 'react';
import { Folder as FolderIcon, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { ChatRow } from './ChatRow';
import { ActionMenu } from './ActionMenu';

interface FolderTreeProps {
    folderId: string;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ folderId }) => {
    const folder = useFolderStore((state) => state.folders[folderId]);
    const toggleFolder = useFolderStore((state) => state.toggleFolder);
    const deleteItem = useFolderStore((state) => state.deleteItem);
    const renameItem = useFolderStore((state) => state.renameItem);
    const addFolder = useFolderStore((state) => state.addFolder);

    // If folder doesn't exist (e.g. deleted), don't render
    if (!folder) return null;

    const handleToggle = () => {
        toggleFolder(folderId);
    };

    const handleDelete = () => {
        if (confirm(`Delete folder "${folder.name}" and contents?`)) {
            deleteItem(folderId, true);
        }
    };

    const handleRename = () => {
        const newName = prompt("Rename folder:", folder.name);
        if (newName && newName.trim()) {
            renameItem(folderId, newName.trim(), true);
        }
    };

    const handleAddSubFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        const name = prompt("New Folder Name:");
        if (name) {
            addFolder(name, folderId);
            if (!folder.isOpen) toggleFolder(folderId);
        }
    };

    return (
        <div>
            {/* Folder Row */}
            <div
                className="flex items-center group py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer select-none transition-colors"
                onClick={handleToggle}
            >
                <span className="mr-1 text-gray-400">
                    {folder.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>

                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                    {folder.isOpen ?
                        <FolderOpen size={16} className="text-yellow-500 flex-shrink-0" /> :
                        <FolderIcon size={16} className="text-yellow-500 flex-shrink-0" />
                    }
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{folder.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({folder.items.length + folder.children.length})</span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 flex items-center">
                    <button
                        onClick={handleAddSubFolder}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 mr-1 transition-colors"
                        title="Add Subfolder"
                    >
                        <FolderIcon size={12} />+
                    </button>
                    <ActionMenu onRename={handleRename} onDelete={handleDelete} />
                </div>
            </div>

            {/* Children */}
            {folder.isOpen && (
                <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-1">
                    {folder.children.map((childId) => (
                        <FolderTree key={childId} folderId={childId} />
                    ))}
                    {folder.items.map((chatId) => (
                        <ChatRow key={chatId} chatId={chatId} />
                    ))}

                    {folder.children.length === 0 && folder.items.length === 0 && (
                        <div className="text-xs text-gray-300 py-1 pl-4 italic">Empty</div>
                    )}
                </div>
            )}
        </div>
    );
};
