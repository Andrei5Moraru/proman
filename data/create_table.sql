DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS statuses;
DROP TABLE IF EXISTS users;




CREATE TABLE boards
(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL,
    user_id integer

);


CREATE TABLE cards
(
    id SERIAL PRIMARY KEY NOT NULL,
    board_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    status_id INTEGER NOT NULL,
    rank INTEGER NOT NULL
);


CREATE TABLE statuses
(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY NOT NULL,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL
);

ALTER TABLE ONLY cards
ADD CONSTRAINT fk_cards_board_id FOREIGN KEY
(board_id) REFERENCES boards
(id);


ALTER TABLE ONLY cards
ADD CONSTRAINT fk_cards_status_id FOREIGN KEY
(status_id) REFERENCES statuses
(id);

ALTER TABLE ONLY boards
ADD CONSTRAINT fk_boards_user_id FOREIGN KEY
(user_id) REFERENCES users
(id);

INSERT INTO statuses
    (title)
VALUES
    ('New');
INSERT INTO statuses
    (title)
VALUES
    ('In progress');
INSERT INTO statuses
    (title)
VALUES
    ('Testing');
INSERT INTO statuses
    (title)
VALUES
    ('Done');
