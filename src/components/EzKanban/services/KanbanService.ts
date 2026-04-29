import type { IKanbanService, KanbanBoard, KanbanCard, KanbanColumn, KanbanSwimlane } from '../EzKanban.types';

/**
 * Kanban service implementation following the ServiceRegistry pattern.
 * Uses instance-local in-memory storage for demos and tests.
 */
export class KanbanService implements IKanbanService {
    name = 'KanbanService';
    private boards = new Map<string, KanbanBoard>();

    async init(): Promise<void> {
    }

    async cleanup(): Promise<void> {
    }

    /**
     * Seeds the mock database with initial data.
     * Useful for demos and tests.
     */
    initializeWithData(boards: KanbanBoard[]) {
        boards.forEach(board => {
            if (!this.boards.has(board.id)) {
                this.boards.set(board.id, JSON.parse(JSON.stringify(board))); // Deep copy
            }
        });
    }

    // ────────────────────────────────────────────────
    // Board Operations
    // ────────────────────────────────────────────────

    async getBoard(boardId: string): Promise<KanbanBoard> {
        await this.simulateLatency();
        const board = this.boards.get(boardId);
        if (!board) {
            throw new Error(`Board with ID ${boardId} not found`);
        }
        return JSON.parse(JSON.stringify(board)); // Return copy
    }

    async createBoard(board: Partial<KanbanBoard>): Promise<KanbanBoard> {
        await this.simulateLatency();
        const newBoard: KanbanBoard = {
            id: board.id || `board-${Date.now()}`,
            name: board.name || 'Untitled Board',
            description: board.description,
            columns: board.columns || [],
            cards: board.cards || [],
            permissions: board.permissions,
            settings: board.settings || {
                allowDragAndDrop: true,
                allowMultiSelect: true,
                enableWipLimits: false,
                defaultView: 'standard',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.boards.set(newBoard.id, newBoard);
        return newBoard;
    }

    async updateBoard(boardId: string, updates: Partial<KanbanBoard>): Promise<void> {
        await this.simulateLatency();
        const board = this.boards.get(boardId);
        if (!board) throw new Error(`Board with ID ${boardId} not found`);

        const updatedBoard = {
            ...board,
            ...updates,
            updatedAt: new Date(),
        };
        this.boards.set(boardId, updatedBoard);
    }

    async deleteBoard(boardId: string): Promise<void> {
        await this.simulateLatency();
        this.boards.delete(boardId);
    }

    // ────────────────────────────────────────────────
    // Card Operations
    // ────────────────────────────────────────────────

    async createCard(boardId: string, card: Partial<KanbanCard>): Promise<KanbanCard> {
        await this.simulateLatency();
        const board = this.boards.get(boardId);
        if (!board) throw new Error(`Board with ID ${boardId} not found`);

        const newCard: KanbanCard = {
            id: card.id || `card-${Date.now()}`,
            type: card.type || 'standard',
            title: card.title || 'Untitled Card',
            description: card.description,
            columnId: card.columnId || board.columns[0]?.id || '',
            position: card.position ?? board.cards.filter(c => c.columnId === card.columnId).length,
            assignees: card.assignees || [],
            tags: card.tags || [],
            priority: card.priority,
            metadata: card.metadata || {},
            createdBy: card.createdBy || 'current-user',
            createdAt: new Date(),
            updatedBy: card.updatedBy || 'current-user',
            updatedAt: new Date(),
            ...card,
        };

        board.cards.push(newCard);
        this.boards.set(boardId, board); // Update DB

        return newCard;
    }

    async updateCard(cardId: string, updates: Partial<KanbanCard>): Promise<void> {
        await this.simulateLatency();
        // Search across all boards (or assume we know context)
        for (const [boardId, board] of this.boards.entries()) {
            const cardIndex = board.cards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                board.cards[cardIndex] = {
                    ...board.cards[cardIndex],
                    ...updates,
                    updatedAt: new Date(),
                };
                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Card with ID ${cardId} not found`);
    }

    async deleteCard(cardId: string): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const filteredCards = board.cards.filter(c => c.id !== cardId);
            if (filteredCards.length !== board.cards.length) {
                board.cards = filteredCards;
                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Card with ID ${cardId} not found`);
    }

    async moveCard(
        cardId: string,
        targetColumnId: string,
        targetSwimlaneId?: string,
        targetPosition?: number
    ): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const card = board.cards.find(c => c.id === cardId);
            if (card) {
                card.columnId = targetColumnId;
                if (targetSwimlaneId !== undefined) card.swimlaneId = targetSwimlaneId;
                if (targetPosition !== undefined) card.position = targetPosition;
                card.updatedAt = new Date();

                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Card with ID ${cardId} not found`);
    }

    // ────────────────────────────────────────────────
    // Column Operations
    // ────────────────────────────────────────────────

    async createColumn(boardId: string, column: Partial<KanbanColumn>): Promise<KanbanColumn> {
        await this.simulateLatency();
        const board = this.boards.get(boardId);
        if (!board) throw new Error(`Board with ID ${boardId} not found`);

        const newColumn: KanbanColumn = {
            id: column.id || `column-${Date.now()}`,
            name: column.name || 'Untitled Column',
            color: column.color,
            icon: column.icon,
            wipLimit: column.wipLimit,
            position: column.position ?? board.columns.length,
            isCollapsed: column.isCollapsed || false,
        };

        board.columns.push(newColumn);
        this.boards.set(boardId, board);

        return newColumn;
    }

    async updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const columnIndex = board.columns.findIndex(c => c.id === columnId);
            if (columnIndex !== -1) {
                board.columns[columnIndex] = {
                    ...board.columns[columnIndex],
                    ...updates,
                };
                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Column with ID ${columnId} not found`);
    }

    async deleteColumn(columnId: string): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const filteredColumns = board.columns.filter(c => c.id !== columnId);
            if (filteredColumns.length !== board.columns.length) {
                // Also remove cards in this column
                const filteredCards = board.cards.filter(c => c.columnId !== columnId);
                board.columns = filteredColumns;
                board.cards = filteredCards;
                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Column with ID ${columnId} not found`);
    }


    // ────────────────────────────────────────────────
    // Swimlane Operations
    // ────────────────────────────────────────────────

    async createSwimlane(boardId: string, swimlane: Partial<KanbanSwimlane>): Promise<KanbanSwimlane> {
        await this.simulateLatency();
        const board = this.boards.get(boardId);
        if (!board) throw new Error(`Board with ID ${boardId} not found`);

        const newSwimlane: KanbanSwimlane = {
            id: swimlane.id || `swimlane-${Date.now()}`,
            name: swimlane.name || 'New Swimlane',
            type: swimlane.type || 'custom',
            color: swimlane.color,
            position: swimlane.position ?? (board.swimlanes?.length || 0),
            isCollapsed: false,
            ...swimlane,
        };

        const swimlanes = board.swimlanes || [];
        swimlanes.push(newSwimlane);
        board.swimlanes = swimlanes;
        this.boards.set(boardId, board);

        return newSwimlane;
    }

    async updateSwimlane(swimlaneId: string, updates: Partial<KanbanSwimlane>): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const swimlanes = board.swimlanes || [];
            const swimlaneIndex = swimlanes.findIndex(s => s.id === swimlaneId);

            if (swimlaneIndex !== -1) {
                swimlanes[swimlaneIndex] = {
                    ...swimlanes[swimlaneIndex],
                    ...updates,
                };
                board.swimlanes = swimlanes;
                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Swimlane with ID ${swimlaneId} not found`);
    }

    async deleteSwimlane(swimlaneId: string): Promise<void> {
        await this.simulateLatency();
        for (const [boardId, board] of this.boards.entries()) {
            const swimlanes = board.swimlanes || [];
            if (swimlanes.some(s => s.id === swimlaneId)) {
                // Remove swimlane
                board.swimlanes = swimlanes.filter(s => s.id !== swimlaneId);

                // Unassign cards from this swimlane
                board.cards = board.cards.map(card =>
                    card.swimlaneId === swimlaneId ? { ...card, swimlaneId: undefined } : card
                );

                this.boards.set(boardId, board);
                return;
            }
        }
        throw new Error(`Swimlane with ID ${swimlaneId} not found`);
    }

    private simulateLatency(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
}
