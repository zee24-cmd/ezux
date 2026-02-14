import { useState, useCallback } from 'react';

export const useDeleteConfirmation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('Confirm Delete');
    const [message, setMessage] = useState<string>('Are you sure you want to delete this item? This action cannot be undone.');

    const requestDelete = useCallback((id: string, customTitle?: string, customMessage?: string) => {
        setIdToDelete(id);
        if (customTitle) setTitle(customTitle);
        if (customMessage) setMessage(customMessage);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setIdToDelete(null);
    }, []);

    return {
        isOpen,
        idToDelete,
        title,
        message,
        requestDelete,
        close,
        setIsOpen
    };
};
