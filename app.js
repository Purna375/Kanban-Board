/**
 * Kanban Board Application
 * Features: Create boards, drag cards between columns, LocalStorage persistence, keyboard accessibility
 */

// ==================== Data Management ====================

const STORAGE_KEY = 'kanban-boards';

/**
 * Get all boards from LocalStorage
 * @returns {Object} Object containing all boards
 */
function getBoards() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error reading from LocalStorage:', error);
        return {};
    }
}

/**
 * Save all boards to LocalStorage
 * @param {Object} boards - Object containing all boards
 */
function saveBoards(boards) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    } catch (error) {
        console.error('Error saving to LocalStorage:', error);
    }
}

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// ==================== State Management ====================

let currentBoardId = null;
let selectedCard = null;

// ==================== DOM Elements ====================

const boardContainer = document.getElementById('board-container');
const boardSelector = document.getElementById('board-selector');
const createBoardBtn = document.getElementById('create-board-btn');
const deleteBoardBtn = document.getElementById('delete-board-btn');
const addColumnBtn = document.getElementById('add-column-btn');

// Modals
const boardModal = document.getElementById('board-modal');
const boardForm = document.getElementById('board-form');
const boardNameInput = document.getElementById('board-name');
const cancelBoardBtn = document.getElementById('cancel-board-btn');

const columnModal = document.getElementById('column-modal');
const columnForm = document.getElementById('column-form');
const columnNameInput = document.getElementById('column-name');
const cancelColumnBtn = document.getElementById('cancel-column-btn');

const cardModal = document.getElementById('card-modal');
const cardForm = document.getElementById('card-form');
const cardTitleInput = document.getElementById('card-title');
const cardDescriptionInput = document.getElementById('card-description');
const cardColumnIdInput = document.getElementById('card-column-id');
const cardIdInput = document.getElementById('card-id');
const cancelCardBtn = document.getElementById('cancel-card-btn');

// ==================== Board Functions ====================

/**
 * Create a new board
 * @param {string} name - Board name
 * @returns {string} New board ID
 */
function createBoard(name) {
    const boards = getBoards();
    const id = generateId();
    boards[id] = {
        id,
        name,
        columns: [],
        createdAt: new Date().toISOString()
    };
    saveBoards(boards);
    return id;
}

/**
 * Delete a board
 * @param {string} boardId - Board ID to delete
 */
function deleteBoard(boardId) {
    const boards = getBoards();
    delete boards[boardId];
    saveBoards(boards);
}

/**
 * Get a specific board
 * @param {string} boardId - Board ID
 * @returns {Object|null} Board object or null
 */
function getBoard(boardId) {
    const boards = getBoards();
    return boards[boardId] || null;
}

/**
 * Update board selector dropdown
 */
function updateBoardSelector() {
    const boards = getBoards();
    const boardIds = Object.keys(boards);
    
    // Clear existing options except the first one
    while (boardSelector.options.length > 1) {
        boardSelector.remove(1);
    }
    
    // Add board options
    boardIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = boards[id].name;
        boardSelector.appendChild(option);
    });
    
    // Select current board if exists
    if (currentBoardId && boards[currentBoardId]) {
        boardSelector.value = currentBoardId;
    }
}

// ==================== Column Functions ====================

/**
 * Add a column to a board
 * @param {string} boardId - Board ID
 * @param {string} name - Column name
 * @returns {string} New column ID
 */
function addColumn(boardId, name) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return null;
    
    const columnId = generateId();
    board.columns.push({
        id: columnId,
        name,
        cards: []
    });
    saveBoards(boards);
    return columnId;
}

/**
 * Delete a column
 * @param {string} boardId - Board ID
 * @param {string} columnId - Column ID
 */
function deleteColumn(boardId, columnId) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return;
    
    board.columns = board.columns.filter(col => col.id !== columnId);
    saveBoards(boards);
}

/**
 * Update column name
 * @param {string} boardId - Board ID
 * @param {string} columnId - Column ID
 * @param {string} newName - New column name
 */
function updateColumnName(boardId, columnId, newName) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return;
    
    const column = board.columns.find(col => col.id === columnId);
    if (column) {
        column.name = newName;
        saveBoards(boards);
    }
}

// ==================== Card Functions ====================

/**
 * Add a card to a column
 * @param {string} boardId - Board ID
 * @param {string} columnId - Column ID
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @returns {string} New card ID
 */
function addCard(boardId, columnId, title, description = '') {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return null;
    
    const column = board.columns.find(col => col.id === columnId);
    if (!column) return null;
    
    const cardId = generateId();
    column.cards.push({
        id: cardId,
        title,
        description,
        createdAt: new Date().toISOString()
    });
    saveBoards(boards);
    return cardId;
}

/**
 * Update a card
 * @param {string} boardId - Board ID
 * @param {string} columnId - Column ID
 * @param {string} cardId - Card ID
 * @param {string} title - New title
 * @param {string} description - New description
 */
function updateCard(boardId, columnId, cardId, title, description) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return;
    
    const column = board.columns.find(col => col.id === columnId);
    if (!column) return;
    
    const card = column.cards.find(c => c.id === cardId);
    if (card) {
        card.title = title;
        card.description = description;
        saveBoards(boards);
    }
}

/**
 * Delete a card
 * @param {string} boardId - Board ID
 * @param {string} columnId - Column ID
 * @param {string} cardId - Card ID
 */
function deleteCard(boardId, columnId, cardId) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return;
    
    const column = board.columns.find(col => col.id === columnId);
    if (!column) return;
    
    column.cards = column.cards.filter(c => c.id !== cardId);
    saveBoards(boards);
}

/**
 * Move a card to a different column
 * @param {string} boardId - Board ID
 * @param {string} sourceColumnId - Source column ID
 * @param {string} targetColumnId - Target column ID
 * @param {string} cardId - Card ID
 * @param {number} targetIndex - Index to insert at in target column
 */
function moveCard(boardId, sourceColumnId, targetColumnId, cardId, targetIndex = -1) {
    const boards = getBoards();
    const board = boards[boardId];
    if (!board) return;
    
    const sourceColumn = board.columns.find(col => col.id === sourceColumnId);
    const targetColumn = board.columns.find(col => col.id === targetColumnId);
    if (!sourceColumn || !targetColumn) return;
    
    const cardIndex = sourceColumn.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const [card] = sourceColumn.cards.splice(cardIndex, 1);
    
    if (targetIndex === -1 || targetIndex >= targetColumn.cards.length) {
        targetColumn.cards.push(card);
    } else {
        targetColumn.cards.splice(targetIndex, 0, card);
    }
    
    saveBoards(boards);
}

// ==================== Render Functions ====================

/**
 * Render the current board
 */
function renderBoard() {
    if (!currentBoardId) {
        boardContainer.innerHTML = '<p class="empty-state">Create a new board to get started!</p>';
        addColumnBtn.style.display = 'none';
        deleteBoardBtn.disabled = true;
        return;
    }
    
    const board = getBoard(currentBoardId);
    if (!board) {
        currentBoardId = null;
        renderBoard();
        return;
    }
    
    deleteBoardBtn.disabled = false;
    addColumnBtn.style.display = 'block';
    
    if (board.columns.length === 0) {
        boardContainer.innerHTML = '<p class="empty-state">Add a column to start organizing your tasks!</p>';
        return;
    }
    
    boardContainer.innerHTML = board.columns.map(column => renderColumn(column)).join('');
    
    // Add event listeners for drag and drop
    initDragAndDrop();
}

/**
 * Render a column
 * @param {Object} column - Column object
 * @returns {string} HTML string
 */
function renderColumn(column) {
    const cardsHtml = column.cards.map(card => renderCard(card, column.id)).join('');
    
    return `
        <div class="column" data-column-id="${column.id}" role="region" aria-label="${column.name} column">
            <div class="column-header">
                <h3>${escapeHtml(column.name)}</h3>
                <div class="column-header-actions">
                    <button class="edit-column-btn" data-column-id="${column.id}" 
                            aria-label="Edit ${column.name} column" title="Edit column">
                        ✏️
                    </button>
                    <button class="delete-column-btn" data-column-id="${column.id}" 
                            aria-label="Delete ${column.name} column" title="Delete column">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="cards-container" data-column-id="${column.id}" 
                 role="list" aria-label="Cards in ${column.name}">
                ${cardsHtml}
            </div>
            <button class="add-card-btn" data-column-id="${column.id}" 
                    aria-label="Add card to ${column.name}">
                + Add a card
            </button>
        </div>
    `;
}

/**
 * Render a card
 * @param {Object} card - Card object
 * @param {string} columnId - Column ID
 * @returns {string} HTML string
 */
function renderCard(card, columnId) {
    const descriptionHtml = card.description 
        ? `<p class="card-description">${escapeHtml(card.description)}</p>` 
        : '';
    
    return `
        <div class="card" data-card-id="${card.id}" data-column-id="${columnId}" 
             draggable="true" tabindex="0" role="listitem"
             aria-label="${card.title}. Press Enter to edit, Delete to remove, or arrow keys to move.">
            <div class="card-title">${escapeHtml(card.title)}</div>
            ${descriptionHtml}
            <div class="card-actions">
                <button class="edit-card-btn" data-card-id="${card.id}" data-column-id="${columnId}"
                        aria-label="Edit ${card.title}" title="Edit card">
                    ✏️
                </button>
                <button class="delete-card-btn" data-card-id="${card.id}" data-column-id="${columnId}"
                        aria-label="Delete ${card.title}" title="Delete card">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Drag and Drop ====================

let draggedCard = null;
let draggedCardColumnId = null;

/**
 * Initialize drag and drop functionality
 */
function initDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const containers = document.querySelectorAll('.cards-container');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
    
    containers.forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedCard = e.target;
    draggedCardColumnId = e.target.dataset.columnId;
    e.target.classList.add('dragging');
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
    
    // Announce to screen readers
    announceToScreenReader(`Grabbed ${e.target.querySelector('.card-title').textContent}. Use arrow keys or drag to move.`);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCard = null;
    draggedCardColumnId = null;
    
    // Remove drag-over class from all containers
    document.querySelectorAll('.cards-container').forEach(container => {
        container.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedCard) return;
    
    const targetColumnId = e.currentTarget.dataset.columnId;
    const cardId = draggedCard.dataset.cardId;
    
    // Calculate target index based on drop position
    const cards = [...e.currentTarget.querySelectorAll('.card:not(.dragging)')];
    const targetIndex = cards.findIndex(card => {
        const rect = card.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
    });
    
    moveCard(currentBoardId, draggedCardColumnId, targetColumnId, cardId, targetIndex);
    renderBoard();
    
    // Announce to screen readers
    const board = getBoard(currentBoardId);
    const targetColumn = board.columns.find(col => col.id === targetColumnId);
    announceToScreenReader(`Moved card to ${targetColumn.name}`);
}

// ==================== Keyboard Navigation ====================

/**
 * Handle keyboard navigation for cards
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    const activeElement = document.activeElement;
    
    // Handle modal escape
    if (e.key === 'Escape') {
        if (!boardModal.hidden) {
            closeModal(boardModal);
        } else if (!columnModal.hidden) {
            closeModal(columnModal);
        } else if (!cardModal.hidden) {
            closeModal(cardModal);
        } else if (selectedCard) {
            deselectCard();
        }
        return;
    }
    
    // Check if a card is focused
    if (activeElement && activeElement.classList.contains('card')) {
        handleCardKeyboard(e, activeElement);
    }
}

function handleCardKeyboard(e, cardElement) {
    const cardId = cardElement.dataset.cardId;
    const columnId = cardElement.dataset.columnId;
    const board = getBoard(currentBoardId);
    if (!board) return;
    
    const columnIndex = board.columns.findIndex(col => col.id === columnId);
    const column = board.columns[columnIndex];
    const cardIndex = column.cards.findIndex(c => c.id === cardId);
    
    switch (e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault();
            // Edit card
            openCardModal(columnId, cardId);
            break;
            
        case 'Delete':
        case 'Backspace':
            e.preventDefault();
            if (confirm('Are you sure you want to delete this card?')) {
                deleteCard(currentBoardId, columnId, cardId);
                renderBoard();
                announceToScreenReader('Card deleted');
            }
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            // Move to previous column
            if (columnIndex > 0) {
                const prevColumn = board.columns[columnIndex - 1];
                moveCard(currentBoardId, columnId, prevColumn.id, cardId);
                renderBoard();
                focusCard(cardId);
                announceToScreenReader(`Moved card to ${prevColumn.name}`);
            }
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            // Move to next column
            if (columnIndex < board.columns.length - 1) {
                const nextColumn = board.columns[columnIndex + 1];
                moveCard(currentBoardId, columnId, nextColumn.id, cardId);
                renderBoard();
                focusCard(cardId);
                announceToScreenReader(`Moved card to ${nextColumn.name}`);
            }
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            // Move up within column
            if (cardIndex > 0) {
                const targetIndex = cardIndex - 1;
                moveCard(currentBoardId, columnId, columnId, cardId, targetIndex);
                renderBoard();
                focusCard(cardId);
                announceToScreenReader('Moved card up');
            }
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            // Move down within column
            if (cardIndex < column.cards.length - 1) {
                const targetIndex = cardIndex + 2;
                moveCard(currentBoardId, columnId, columnId, cardId, targetIndex);
                renderBoard();
                focusCard(cardId);
                announceToScreenReader('Moved card down');
            }
            break;
    }
}

/**
 * Focus a card by ID
 * @param {string} cardId - Card ID to focus
 */
function focusCard(cardId) {
    setTimeout(() => {
        const card = document.querySelector(`.card[data-card-id="${cardId}"]`);
        if (card) {
            card.focus();
        }
    }, 10);
}

/**
 * Select a card
 * @param {HTMLElement} cardElement - Card element to select
 */
function selectCard(cardElement) {
    deselectCard();
    selectedCard = cardElement;
    cardElement.classList.add('selected');
}

/**
 * Deselect current card
 */
function deselectCard() {
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard = null;
    }
}

// ==================== Accessibility ====================

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ==================== Modal Functions ====================

/**
 * Open a modal
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} focusElement - Element to focus
 */
function openModal(modal, focusElement) {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus first input
    setTimeout(() => {
        if (focusElement) {
            focusElement.focus();
        }
    }, 10);
    
    // Trap focus in modal
    modal.addEventListener('keydown', trapFocus);
}

/**
 * Close a modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('keydown', trapFocus);
    
    // Reset form
    const form = modal.querySelector('form');
    if (form) form.reset();
}

/**
 * Trap focus within modal
 * @param {KeyboardEvent} e - Keyboard event
 */
function trapFocus(e) {
    if (e.key !== 'Tab') return;
    
    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

/**
 * Open card modal for adding/editing
 * @param {string} columnId - Column ID
 * @param {string} cardId - Card ID (optional, for editing)
 */
function openCardModal(columnId, cardId = null) {
    const modalTitle = document.getElementById('card-modal-title');
    
    if (cardId) {
        // Edit mode
        modalTitle.textContent = 'Edit Card';
        const board = getBoard(currentBoardId);
        const column = board.columns.find(col => col.id === columnId);
        const card = column.cards.find(c => c.id === cardId);
        
        cardTitleInput.value = card.title;
        cardDescriptionInput.value = card.description || '';
        cardIdInput.value = cardId;
    } else {
        // Add mode
        modalTitle.textContent = 'Add Card';
        cardIdInput.value = '';
    }
    
    cardColumnIdInput.value = columnId;
    openModal(cardModal, cardTitleInput);
}

// ==================== Event Listeners ====================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Board controls
    createBoardBtn.addEventListener('click', () => {
        openModal(boardModal, boardNameInput);
    });
    
    deleteBoardBtn.addEventListener('click', () => {
        if (currentBoardId && confirm('Are you sure you want to delete this board?')) {
            deleteBoard(currentBoardId);
            currentBoardId = null;
            updateBoardSelector();
            renderBoard();
            announceToScreenReader('Board deleted');
        }
    });
    
    boardSelector.addEventListener('change', (e) => {
        currentBoardId = e.target.value || null;
        renderBoard();
    });
    
    addColumnBtn.addEventListener('click', () => {
        openModal(columnModal, columnNameInput);
    });
    
    // Board modal
    boardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = boardNameInput.value.trim();
        if (name) {
            const newBoardId = createBoard(name);
            currentBoardId = newBoardId;
            updateBoardSelector();
            renderBoard();
            closeModal(boardModal);
            announceToScreenReader(`Board "${name}" created`);
        }
    });
    
    cancelBoardBtn.addEventListener('click', () => {
        closeModal(boardModal);
    });
    
    // Column modal
    columnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = columnNameInput.value.trim();
        if (name && currentBoardId) {
            addColumn(currentBoardId, name);
            renderBoard();
            closeModal(columnModal);
            announceToScreenReader(`Column "${name}" added`);
        }
    });
    
    cancelColumnBtn.addEventListener('click', () => {
        closeModal(columnModal);
    });
    
    // Card modal
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = cardTitleInput.value.trim();
        const description = cardDescriptionInput.value.trim();
        const columnId = cardColumnIdInput.value;
        const cardId = cardIdInput.value;
        
        if (title && columnId) {
            if (cardId) {
                // Update existing card
                updateCard(currentBoardId, columnId, cardId, title, description);
                announceToScreenReader('Card updated');
            } else {
                // Add new card
                addCard(currentBoardId, columnId, title, description);
                announceToScreenReader('Card added');
            }
            renderBoard();
            closeModal(cardModal);
        }
    });
    
    cancelCardBtn.addEventListener('click', () => {
        closeModal(cardModal);
    });
    
    // Delegate events for dynamic elements
    boardContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // Add card button
        if (target.classList.contains('add-card-btn')) {
            const columnId = target.dataset.columnId;
            openCardModal(columnId);
        }
        
        // Edit card button
        if (target.classList.contains('edit-card-btn')) {
            const columnId = target.dataset.columnId;
            const cardId = target.dataset.cardId;
            openCardModal(columnId, cardId);
        }
        
        // Delete card button
        if (target.classList.contains('delete-card-btn')) {
            const columnId = target.dataset.columnId;
            const cardId = target.dataset.cardId;
            if (confirm('Are you sure you want to delete this card?')) {
                deleteCard(currentBoardId, columnId, cardId);
                renderBoard();
                announceToScreenReader('Card deleted');
            }
        }
        
        // Edit column button
        if (target.classList.contains('edit-column-btn')) {
            const columnId = target.dataset.columnId;
            const board = getBoard(currentBoardId);
            const column = board.columns.find(col => col.id === columnId);
            const newName = prompt('Enter new column name:', column.name);
            if (newName && newName.trim()) {
                updateColumnName(currentBoardId, columnId, newName.trim());
                renderBoard();
                announceToScreenReader('Column renamed');
            }
        }
        
        // Delete column button
        if (target.classList.contains('delete-column-btn')) {
            const columnId = target.dataset.columnId;
            if (confirm('Are you sure you want to delete this column and all its cards?')) {
                deleteColumn(currentBoardId, columnId);
                renderBoard();
                announceToScreenReader('Column deleted');
            }
        }
    });
    
    // Close modals on backdrop click
    [boardModal, columnModal, cardModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// ==================== Initialization ====================

/**
 * Initialize the application
 */
function init() {
    updateBoardSelector();
    renderBoard();
    initEventListeners();
    initKeyboardNavigation();
    
    console.log('Kanban Board initialized');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
