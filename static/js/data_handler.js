// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
  _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
  _api_get: function (url, callback) {
    // it is not called from outside
    // loads data from API, parses it and calls the callback with it

    fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((response) => response.json()) // parse the response as JSON
      .then((json_response) => callback(json_response)); // Call the `callback` with the returned object
  },
  _api_post: function (url, data, callback) {
    // it is not called from outside
    // sends the data to the API, and calls callback function
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json()) // parse the response as JSON
      .then((json_response) => callback(json_response)); // Call the `callback` with the returned object

    // .then(res =>  res.json())
  },

  init: function () {},
  getBoards: function (callback) {
    // the boards are retrieved and then the callback function is called with the boards

    // Here we use an arrow function to keep the value of 'this' on dataHandler.
    //    if we would use function(){...} here, the value of 'this' would change.
    this._api_get('/get-boards', (response) => {
      // this._data['boards'] = response.boards;
      callback(response.boards);
    });
  },
  getCards: function (callback) {
    this._api_get('/get-cards', (response) => {
      // this._data['cards'] = response.cards;
      callback(response.cards);
    });
  },
  getStatuses: function (callback) {
    this._api_get('/get-statuses', (response) => {
      // this._data['statuses'] = response.statuses;
      callback(response.statuses);
    });
  },

  createNewBoard: function (boardName, callback) {
    let newBoard = { title: boardName };
    this._api_post('/new-board', newBoard, (response) => {
      callback(response);
    });
  },

  getNewBoard: function (boardName, callback) {
    let URL = `/get-board/${boardName}`;
    this._api_get(URL, (response) => {
      callback(response);
    });
  },
  sendNewCard: function (boardID, statusId, cardName, callback) {
    let newCard = { boardId: boardID, status: statusId, name: cardName };
    let URL = '/get-card';
    this._api_post(URL, newCard, (response) => {
      callback(response);
    });
  },

  deleteCardFromServer: function (cardId, callback) {
    let cardToBeDeleted = { card_id: cardId };
    let URL = `/delete-card/${cardId}`;
    this._api_post(URL, cardToBeDeleted, (response) => {
      callback(response);
    });
  },

  getCardId: function (boardID, statusID, title, callback) {
    let URL = `/get-cardID/${boardID}/${statusID}/${title}`;
    this._api_get(URL, (response) => {
      callback(response);
    });
  },

  updateCardStatus: function (cardID, statusID) {
    let cardToBeUpdated = { card_id: cardID, status_id: statusID };
    let URL = '/update-card-status';
    this._api_post(URL, cardToBeUpdated, (response) => {});
  },

  updateBoardTitle: function (boardTitle, boardId, callback) {
    let titleToBeUpdated = { "board_title": boardTitle, "board_id": boardId };
    let URL = '/update-board-title';
    this._api_post(URL, titleToBeUpdated, (response) => {
      callback(response);
    });
  },

  updateCardTitle: function (cardTitle, cardId, callback) {
    let titleToBeUpdated = { "card_title": cardTitle, "card_id": cardId };
    let URL = '/update-card-title';
    this._api_post(URL, titleToBeUpdated, (response) => {
      callback(response);
    });
  },

  deleteBoard: function (boardID, callback) {
    let boardToBeDeleted = {"board_id": boardID};
    let URL = '/delete-board';
    this._api_post(URL, boardToBeDeleted, (response) => {
      callback(response)
    });
  },

};

// getBoard: function (boardId, callback) {
//     // the board is retrieved and then the callback function is called with the board
//     this._api_get(`/get-boards/${boardId}`, (response) => {
//         this._data[`board_${boardId}`] = response;
//         callback(response);
//     });
// },
// getStatuses: function (callback) {
//     // the statuses are retrieved and then the callback function is called with the statuses
//     this._api_get(`/get-statuses`, (response) => {
//         this._data['statuses'] = response;
//         callback(response);
//     });
// },
// getStatus: function (statusId, callback) {
//     // the status is retrieved and then the callback function is called with the status
//     this._api_get(`/get-status/${statusId}`, (response) => {
//         this._data[`status_${statusId}`] = response;
//         callback(response);
//     });
// },
// getCardsByBoardId: function (boardId, callback) {
//     // the cards are retrieved and then the callback function is called with the cards
//     this._api_get(`/get-cards/${boardId}`, (response) => {
//         this._data[`boardcards_${boardId}`] = response;
//         callback(response);
//     });
// },
// getCard: function (cardId, callback) {
//     // the card is retrieved and then the callback function is called with the card
//     this._api_get(`/get-card/${cardId}`, (response) => {
//         this._data[`card_${cardId}`] = response;
//         callback(response);
//     });
// },
// createNewBoard: function (boardTitle, callback) {
//     // creates new board, saves it and calls the callback function with its data
//     this._api_post
// },
// createNewCard: function (cardTitle, boardId, statusId, callback) {
//     // creates new card, saves it and calls the callback function with its data
// }
// // here comes more features
