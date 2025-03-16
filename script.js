let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;
let currentDeleteAction = null;

// Save a note
function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter both title and content!');
        return;
    }

    const note = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString()
    };

    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    clearNote();
    displayNotes();
}

// Clear the note fields
function clearNote() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

// Display saved notes
function displayNotes() {
    const savedNotesDiv = document.getElementById('savedNotes');
    savedNotesDiv.innerHTML = '';

    if (notes.length === 0) {
        savedNotesDiv.innerHTML = '<p>No saved notes yet.</p>';
    }

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'saved-note';
        noteDiv.innerHTML = `
            <strong>${note.title}</strong><br>
            <small>${note.date}</small>
            <button class="edit-note-btn" onclick="editNote(${note.id})">Edit</button>
            <button class="delete-note-btn" onclick="confirmDeleteNote(${note.id})">Delete</button>
            <button class="download-note-btn" onclick="downloadNote(${note.id})">↓</button>
        `;
        noteDiv.dataset.noteId = note.id;
        savedNotesDiv.appendChild(noteDiv);
    });
}

// Download a note as a text file
function downloadNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const fileContent = `Title: ${note.title}\nDate: ${note.date}\n\n${note.content}`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Open the modal and fill it with the note data to edit
function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        document.getElementById('modalTitle').value = note.title;
        document.getElementById('modalContent').value = note.content;
        currentNoteId = note.id;
        document.getElementById('noteModal').style.display = 'block';
    }
}

// Save changes made in the modal
function saveModalNote() {
    const title = document.getElementById('modalTitle').value;
    const content = document.getElementById('modalContent').value;

    if (title.trim() === '' || content.trim() === '') {
        alert('Please enter both title and content!');
        return;
    }

    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].date = new Date().toLocaleString();
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        closeModal();
    }
}

// Close the modal
function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
    currentNoteId = null;
}

// Delete a saved note
function deleteNote() {
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        closeConfirmationModal();
    }
}

// Delete all notes
function deleteAllNotes() {
    localStorage.removeItem('notes');
    notes = [];
    displayNotes();
    closeConfirmationModal();
}

// Confirm deleting all notes
function confirmDeleteAllNotes() {
    closeSettingsModalFunc();
    openConfirmationModal(deleteAllNotes);
}

// Confirmation modal for delete action (Delete single note)
function confirmDeleteNote(noteId) {
    currentNoteId = noteId;
    openConfirmationModal(deleteNote);
}

// Open the confirmation modal
function openConfirmationModal(action) {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'block';
        currentDeleteAction = action;
    } else {
        console.error('Confirmation modal not found');
    }
}

// Close the confirmation modal
function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
        currentDeleteAction = null;
    } else {
        console.error('Confirmation modal not found');
    }
}

// Open settings modal
function openSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'block';
    } else {
        console.error('Settings modal not found');
    }
}

// Close settings modal
function closeSettingsModalFunc() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'none';
    } else {
        console.error('Settings modal not found');
    }
}

// Load dark mode preference and initialize page
function initializePage() {
    displayNotes();
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.checked = darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    } else {
        console.error('Dark mode switch not found');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    initializePage();

    // Settings button listener
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }

    // Close settings modal
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', closeSettingsModalFunc);
    }

    // Close edit modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close confirmation modal (X button)
    const closeConfirmationModalBtn = document.getElementById('closeConfirmationModal');
    if (closeConfirmationModalBtn) {
        closeConfirmationModalBtn.addEventListener('click', closeConfirmationModal);
    }

    // Confirm delete action
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
            if (currentDeleteAction) {
                currentDeleteAction();
            }
            closeConfirmationModal();
        });
    }

    // Cancel delete action ("No" button)
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeConfirmationModal);
    }

    // Dark mode toggle
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', function () {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', this.checked);
        });
    }
});

// Add confirm clear function
function confirmClearNote() {
    openConfirmationModal(clearNote);
}