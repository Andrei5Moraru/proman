import { dataHandler } from './data_handler.js';

export let dom = {
  init: function () {
    // This function should run once, when the page is loaded.
  },

  // =============================================================================================================================
  loadBoards: function () {
    dataHandler.getBoards(function (boards) {
      dom.showBoards(boards);
      dom.loadStatuses();
      dom.createNewCard();
      dom.showPopupWindow();
      dom.deleteBoard();
    });
  },
  // =============================================================================================================================
  showBoards: function (boards) {
    let boardType;
    let delete_or_not_delete;
    for (let board of boards) {
      if (board.user_id) {
        boardType = 'private';
        delete_or_not_delete = `<i class="fas fa-trash-alt board-delete-button" data-board_id="${board.id}"></i>`;
      } else {
        boardType = 'public';
        delete_or_not_delete = '';
      }
      let boardsContainer = document.querySelector('.board-container');
      boardsContainer.innerHTML += `<section class="board" data-board_id="${board.id}"><div class="board-header">
            <span class="board-title" data-board_id="${board.id}" data-board_type="${boardType}">${board.title}</span>
            <form action="/" method='GET' id='form-new-card'>
            <button type="submit" class="board-add" data-board_id="${board.id}">Add Card</button>
            <input type="text" class="card-input" name='new-board-title' data-board_id="${board.id}" placeholder='Enter name'>
            </form><small class="board-type">${boardType}</small>
            ${delete_or_not_delete}
            <button class="board-toggle" data-board_id="${board.id}"><i class="fas fa-chevron-down"></i></button></div></section>`;
    }
  },
  // =============================================================================================================================
  loadStatuses: function () {
    dataHandler.getStatuses(function (statuses) {
      dom.showStatuses(statuses);
      dom.loadCards();
    });
  },
  // =============================================================================================================================
  showStatuses: function (statuses) {
    let boards = document.querySelectorAll('.board');
    boards.forEach((element) => {
      let stats = '';
      for (let status of statuses) {
        stats += `<div class="board-column drop-zone" data-status_id="${status.id}" data-board_id="${element.dataset.board_id}">
                <div class="board-column-title" data-id="test">${status.title}</div>
                </div>`;
      }
      let outerHtml = `<div class="board-columns" data-board_id="${element.dataset.board_id}">${stats}</div>`;

      element.insertAdjacentHTML('beforeend', outerHtml);
    });
  },
  // =============================================================================================================================
  loadCards: function () {
    dataHandler.getCards(function (cards) {
      dom.showCards(cards);
      dom.editCardTitle();
      dom.cardDelete();
      dom.initDragAndDrop();
      dom.toggleBtn();
    });
  },
  // =============================================================================================================================
  showCards: function (cards) {
    let boards = document.querySelectorAll('.board');
    boards.forEach((element) => {
      for (let card of cards) {
        if (card.board_id === Number(element.dataset.board_id)) {
          let board_child = element.childNodes;
          let board_columns = board_child[1].childNodes;
          let column_content = '';
          let inner_HTML = '';
          board_columns.forEach((column) => {
            if (Number(column.dataset.status_id) === card.status_id) {
              column_content += `<div class="card" data-card_id="${card.id}" data-status_id="${card.status_id}" draggable="true">
                        <div class="card-remove" data-card_id="${card.id}">
                        <i class="fas fa-trash-alt card-delete-button" data-card_id="${card.id}" ></i>
                        </div>
                        <div class="card-title" data-card_id="${card.id}" contenteditable="false">${card.title}</div>
                        </div>`;

              inner_HTML = `<div class="board-column-content draggable" data-board_id="${card.board_id}" data-card_id="${card.id}" data-status_id="${card.status_id}">
                            ${column_content}
                        </div>`;

              column.insertAdjacentHTML('beforeend', inner_HTML);
            }
          });
        }
      }
    });
  },
  // =============================================================================================================================
  createNewBoard: function () {
    let button = document.querySelector('#create-board');
    button.addEventListener('click', function (e) {
      e.preventDefault();
      let boardName = document.getElementById('input').value;
      if (boardName) {
        dataHandler.createNewBoard(boardName, (response) => {
          dataHandler.getNewBoard(boardName, function (data) {
            dom.showBoard(data);
            dataHandler.getStatuses(function (statuses) {
              dom.showSingleBoardStatuses(statuses, data);
              dom.createSingleNewCard();
              dom.cardDelete();
              dom.toggleSingleBtn();
              dom.showPopupWindow();
              dom.deleteBoard();
              document.getElementById('input').value = '';
            });
          });
        });
      } else {
        alert('Please enter a board name');
      }
    });
  },
  // =============================================================================================================================
  createNewCard: function () {
    let button = document.querySelectorAll('.board-add');
    let statusID = 1;
    let allInput = document.querySelectorAll('.card-input');
    let cardName;
    button.forEach((element) => {
      element.addEventListener('click', function (e) {
        e.preventDefault();
        allInput.forEach((input) => {
          if (
            Number(input.dataset.board_id) === Number(element.dataset.board_id)
          ) {
            cardName = input.value;
            if (cardName) {
              dataHandler.sendNewCard(
                element.dataset.board_id,
                statusID,
                cardName,
                () => {
                  dom.showCard(element.dataset.board_id, statusID, cardName);
                  input.value = '';
                  dom.initDragAndDrop();
                },
              );
            } else {
              alert('Please enter a card name');
            }
          }
        });
      });
    });
  },
  // =============================================================================================================================
  createSingleNewCard: function () {
    let button = document.querySelector('.board-add');
    let statusID = 1;
    let allInput = document.querySelectorAll('.card-input');
    let cardName;
    button.addEventListener('click', function (e) {
      e.preventDefault();
      allInput.forEach((input) => {
        if (
          Number(input.dataset.board_id) === Number(button.dataset.board_id)
        ) {
          cardName = input.value;
          if (cardName) {
            dataHandler.sendNewCard(
              button.dataset.board_id,
              statusID,
              cardName,
              () => {
                dom.showCard(button.dataset.board_id, statusID, cardName);
                input.value = '';
                dom.initDragAndDrop();
              },
            );
          } else {
            alert('Please enter a card name');
          }
        }
      });
    });
  },
  // =============================================================================================================================
  showCard: function (boardID, statusID, title) {
    dataHandler.getCardId(boardID, statusID, title, (response) => {
      let boards = document.querySelectorAll('.board');
      boards.forEach((element) => {
        if (Number(boardID) === Number(element.dataset.board_id)) {
          let board_child = element.childNodes;
          let board_columns = board_child[1].childNodes;
          let column_content = '';
          let ceva = '';
          board_columns.forEach((column) => {
            if (Number(column.dataset.status_id) === Number(statusID)) {
              column_content += `<div class="card" data-card_id="${response[0].id}" data-status_id="${statusID}" draggable="true">
                    <div class="card-remove" data-card_id="${response[0].id}">
                        <i class="fas fa-trash-alt card-delete-button" data-card_id="${response[0].id}"></i>
                    </div>
                    <div class="card-title" data-card_id="${response[0].id}" contenteditable="false">${title}</div>
                </div>`;

              ceva = `<div class="board-column-content draggable" data-board_id="${boardID}" data-card_id="${response[0].id}" data-status_id="${statusID}">
                    ${column_content}
                </div>`;
              column.insertAdjacentHTML('beforeend', ceva);
            }
          });
        }
      });
      dom.cardDelete();
      dom.initDragAndDrop();
      dom.editCardTitle();
    });
  },
  // =============================================================================================================================
  showBoard: function (board) {
    let boardsContainer = document.querySelector('.board-container');
    let boardType;
    let delete_or_not_delete;
    if (board[0].user_id) {
      boardType = 'private';
      delete_or_not_delete = `<i class="fas fa-trash-alt board-delete-button" data-board_id="${board[0].id}"></i>`;
    } else {
      boardType = 'public';
      delete_or_not_delete = '';
    }

    let newBoard = `<section class="board" data-board_id="${board[0].id}"><div class="board-header">
        <span class="board-title" data-board_id="${board[0].id}">${board[0].title}</span>
        <form action="/" method='GET' id='form-new-card'>
        <button type="submit" class="board-add" data-board_id="${board[0].id}">Add Card</button>
        <input type="text" class="card-input" name='new-board-title' data-board_id="${board[0].id}" placeholder='Enter name'>
        </form><small class="board-type">${boardType}</small>
        ${delete_or_not_delete}
        <button class="board-toggle" data-board_id="${board[0].id}"><i class="fas fa-chevron-down"></i></button></div></section>`;

    boardsContainer.insertAdjacentHTML('afterbegin', newBoard);
  },
  // =============================================================================================================================
  showSingleBoardStatuses: function (statuses, board) {
    let boardsContainer = document.querySelectorAll('.board');
    boardsContainer.forEach((section) => {
      if (Number(section.dataset.board_id) === Number(board[0].id)) {
        let stats = '';
        for (let status of statuses) {
          stats += `<div class="board-column drop-zone" data-status_id="${status.id}" data-board_id="${section.dataset.board_id}"><div class="board-column-title" data-id="test">${status.title}</div>
                    </div>`;
        }

        let outerHtml = `<div class="board-columns" data-board_id="${section.dataset.board_id}">${stats}</div>`;

        section.insertAdjacentHTML('beforeend', outerHtml);
      }
    });
  },
  // =============================================================================================================================
  deleteCardFromHTML: function (cardId) {
    let cards = document.querySelectorAll('.board-column-content');
    cards.forEach((card) => {
      if (Number(card.dataset.card_id) === Number(cardId)) {
        card.remove();
      }
    });
  },
  // =============================================================================================================================
  cardDelete: function () {
    let deleteBtns = document.querySelectorAll('.card-delete-button');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault;
        if (confirm('All data will be permanently deleted! Are you sure you want to delete this card?')) {
          dataHandler.deleteCardFromServer(btn.dataset.card_id, (response) => {
            dom.deleteCardFromHTML(btn.dataset.card_id);
          });
        }
      });
    });
  },
  // =============================================================================================================================
  initDragAndDrop: function () {
    let draggables = document.querySelectorAll('.draggable');
    let dropZones = document.querySelectorAll('.drop-zone');
    dom.initDraggables(draggables);
    dom.initDropZones(dropZones);
  },
  // =============================================================================================================================
  initDraggables: function (draggables) {
    for (const draggable of draggables) {
      dom.initDraggable(draggable);
    }
  },
  // =============================================================================================================================
  initDropZones: function (dropZones) {
    for (let dropZone of dropZones) {
      dom.initDropZone(dropZone);
    }
  },
  // =============================================================================================================================
  initDraggable: function (draggable) {
    draggable.addEventListener('dragstart', dom.dragStartHandler);
    draggable.addEventListener('drag', dom.dragHandler);
    draggable.addEventListener('dragend', dom.dragEndHandler);
  },
  // =============================================================================================================================
  initDropZone: function (dropZone) {
    dropZone.addEventListener('dragenter', dom.dropZoneEnterHandler);
    dropZone.addEventListener('dragover', dom.dropZoneOverHandler);
    dropZone.addEventListener('dragleave', dom.dropZoneLeaveHandler);
    dropZone.addEventListener('drop', dom.dropZoneDropHandler);
  },
  // =============================================================================================================================
  dragStartHandler: function (e) {
    dom.setDropZonesHighlight();
    this.classList.add('dragged', 'drag-feedback');
    e.dataTransfer.setData('type/dragged-box', 'dragged');
    e.dataTransfer.setData('text/plain', this.textContent.trim());
    dom.deferredOriginChanges(this, 'drag-feedback');
  },
  // =============================================================================================================================
  dragEndHandler: function () {
    dom.setDropZonesHighlight(false);
    this.classList.remove('dragged');
  },
  // =============================================================================================================================
  dropZoneEnterHandler: function (e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
      this.classList.add('over-zone');
      e.preventDefault();
    }
  },
  // =============================================================================================================================
  dropZoneOverHandler: function (e) {
    if (e.dataTransfer.types.includes('type/dragged-box')) {
      e.preventDefault();
    }
  },
  // =============================================================================================================================
  dropZoneLeaveHandler: function (e) {
    if (
      e.dataTransfer.types.includes('type/dragged-box') &&
      e.relatedTarget !== null &&
      e.currentTarget !== e.relatedTarget.closest('.drop-zone')
    ) {
      this.classList.remove('over-zone');
    }
  },
  // =============================================================================================================================
  dropZoneDropHandler: function (e) {
    let draggedElement = document.querySelector('.dragged');
    if (
      Number(draggedElement.dataset.board_id) === Number(this.dataset.board_id)
    ) {
      dataHandler.updateCardStatus(
        draggedElement.dataset.card_id,
        this.dataset.status_id,
      );
      e.currentTarget.appendChild(draggedElement);
    }
    e.preventDefault();
  },
  // =============================================================================================================================
  setDropZonesHighlight: function (highlight = true) {
    const dropZones = document.querySelectorAll('.drop-zone');
    for (const dropZone of dropZones) {
      if (highlight) {
        dropZone.classList.add('active-zone');
      } else {
        dropZone.classList.remove('active-zone');
        dropZone.classList.remove('over-zone');
      }
    }
  },
  // =============================================================================================================================
  deferredOriginChanges: function (origin, dragFeedbackClassName) {
    setTimeout(() => {
      origin.classList.remove(dragFeedbackClassName);
    });
  },

  // =============================================================================================================================
  // nu face nimic functia
  dragHandler: function () {
    let boards = document.querySelectorAll('.board');
  },
  // =============================================================================================================================
  toggleBtn: function () {
    let buttons = document.querySelectorAll('.board-toggle');
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        dom.toggleBoard(button.dataset.board_id);
      });
    });
  },
  // =============================================================================================================================
  toggleBoard: function (boardId) {
    let dataDisplay = document.querySelectorAll('.board-columns');
    dataDisplay.forEach((element) => {
      if (Number(element.dataset.board_id) === Number(boardId)) {
        if (element.style.display === 'flex') {
          element.style.display = 'none';
        } else {
          element.style.display = 'flex';
        }
      }
    });
  },
  // =============================================================================================================================
  toggleSingleBtn: function () {
    let button = document.querySelector('.board-toggle');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      dom.toggleBoard(button.dataset.board_id);
    });
  },
  // =============================================================================================================================
  showPopupWindow: function () {
    let boardsTitle = document.querySelectorAll('.board-title');
    let popupForm = document.querySelector('.popup-wrapper');
    boardsTitle.forEach((boardTitle) => {
      boardTitle.addEventListener('dblclick', function () {
        popupForm.dataset.board_id = boardTitle.dataset.board_id;
        popupForm.style.visibility = 'visible';
      });
    });
    dom.addEventOnPopup();
  },
  // =============================================================================================================================
  addEventOnPopup: function () {
    let popupForm = document.querySelector('.popup-wrapper');
    popupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let newTitle = document.getElementById('title').value;
      dataHandler.updateBoardTitle(
        newTitle,
        popupForm.dataset.board_id,
        (response) => {
          popupForm.style.visibility = 'hidden';
          let boardsTitle = document.querySelectorAll('.board-title');
          boardsTitle.forEach((title) => {
            if (title.dataset.board_id === popupForm.dataset.board_id) {
              title.innerHTML = `${newTitle}`;
            }
          });
        },
      );
    });
    dom.closePopupEvent(popupForm);
  },
  // =============================================================================================================================
  closePopupEvent: function (popupForm) {
    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        popupForm.style.visibility = 'hidden';
      }
    });
  },
  // =============================================================================================================================

  editCardTitle: function () {
    let cardsTitle = document.querySelectorAll('.card-title');
    cardsTitle.forEach((cardTitle) => {
      cardTitle.addEventListener('dblclick', (e) => {
        cardTitle.setAttribute('contenteditable', 'true');
      });
    });
    dom.updateCardTitle();
  },

  updateCardTitle: function () {
    let cardsTitle = document.querySelectorAll('.card-title');
    cardsTitle.forEach((cardTitle) => {
      cardTitle.addEventListener('focusout', () => {
        let newTitle = cardTitle.innerText;
        dataHandler.updateCardTitle(
          newTitle,
          cardTitle.dataset.card_id,
          (response) => {
            cardTitle.setAttribute('contenteditable', 'false');
          },
        );
      });
    });
  },
  // =============================================================================================================================
  deleteBoard: function () {
    let buttons = document.querySelectorAll('.board-delete-button');
    let boards = document.querySelectorAll('.board');
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        if (confirm('All data will be permanently deleted! Are you sure you want to delete this board? ')) {
          dataHandler.deleteBoard(button.dataset.board_id, (response) => {
            boards.forEach((board) => {
              if (
                Number(board.dataset.board_id) ===
                Number(button.dataset.board_id)
              ) {
                board.remove();
              }
            });
          });
        }
      });
    });
  },
};
