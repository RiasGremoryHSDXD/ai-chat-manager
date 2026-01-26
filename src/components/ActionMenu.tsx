import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface ActionMenuProps {
    onRename: () => void;
    onDelete: () => void;
    onMove?: () => void; // Placeholder for now
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onRename, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
                <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onRename(); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                        <Edit2 size={14} /> Rename
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};
