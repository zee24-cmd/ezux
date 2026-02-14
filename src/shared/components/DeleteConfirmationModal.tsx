import React from 'react';
import { Modal } from './Modal';
import { Button } from '../../components/ui/button';
import { useI18n } from '../hooks/useI18n';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    description?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    description
}) => {
    const { t } = useI18n();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || t('confirm_delete') || 'Confirm Delete'}
            size="sm"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>
                        {t('cancel') || 'Cancel'}
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        {t('delete') || 'Delete'}
                    </Button>
                </div>
            }
        >
            <div className="py-2">
                <p>{message || t('confirm_delete_message') || 'Are you sure you want to delete this item?'}</p>
                {(description || t('action_cannot_be_undone')) && (
                    <p className="text-sm text-muted-foreground mt-2">
                        {description || t('action_cannot_be_undone') || 'This action cannot be undone.'}
                    </p>
                )}
            </div>
        </Modal>
    );
};
