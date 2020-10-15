# import persistence
import connection
from psycopg2 import sql


@connection.connection_handler
def get_boards(cursor):
    query = """
    SELECT *
    FROM boards
    WHERE user_id IS NULL ;"""

    dic = {}
    cursor.execute(query)
    dic['boards'] = cursor.fetchall()
    return dic


@connection.connection_handler
def get_user_and_public_boards(cursor, user_name):
    query = """
    SELECT *
    FROM users
    WHERE user_name = %s
    """
    cursor.execute(query, (user_name, ))
    user_id = cursor.fetchall()[0]['id']

    query2 = """
        SELECT *
        FROM boards
        WHERE user_id IS null OR user_id = %s
        """
    cursor.execute(query2, (user_id, ))
    data_list = {}
    data_list['boards'] = cursor.fetchall()
    return data_list


@connection.connection_handler
def add_board_for_user(cursor, user_name, board_name):
    query = """
    SELECT *
    FROM users
    WHERE user_name = %s
    """
    cursor.execute(query, (user_name, ))
    user_id = cursor.fetchall()[0]['id']

    query2 = """
    INSERT INTO boards (title, user_id)
    VALUES (%s, %s)
    """
    cursor.execute(query2, (board_name, user_id, ))


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    query = """
    SELECT boards.id AS board_id, boards.title AS board_title, cards.id AS card_id, cards.title AS card_title,  status_id , rank
    FROM boards
    JOIN cards
    ON boards.id  =  cards.board_id
    WHERE boards.id = %s
    """
    cursor.execute(query, (board_id, ))
    return cursor.fetchall()


@connection.connection_handler
def get_one_board(cursor, title):
    query = """
    SELECT *
    FROM boards
    WHERE title =%s;"""

    cursor.execute(query, (title, ))
    return cursor.fetchall()


@connection.connection_handler
def get_one_card(cursor, card_id):
    query = """
    SELECT *
    FROM cards
    WHERE id =%s;"""

    cursor.execute(query, (card_id, ))
    return cursor.fetchall()


@connection.connection_handler
def get_all_cards(cursor):
    query = """
    SELECT *
    FROM cards"""

    dic = {}
    cursor.execute(query)
    dic['cards'] = cursor.fetchall()
    return dic


@connection.connection_handler
def get_all_statuses(cursor):
    query = """
    SELECT *
    FROM statuses"""
    dic = {}
    cursor.execute(query)
    dic['statuses'] = cursor.fetchall()
    return dic


@connection.connection_handler
def get_one_status(cursor, status_id):
    query = """
    SELECT *
    FROM statuses
    WHERE id =%s"""

    cursor.execute(query, (status_id, ))
    return cursor.fetchall()


@connection.connection_handler
def add_board(cursor, title):
    query = """
    INSERT INTO boards (title)
    VALUES(%s);"""
    cursor.execute(query, (title, ))


@connection.connection_handler
def add_card(cursor, boardId, statusId, name):
    query = """
    INSERT INTO cards (board_id, title, status_id, rank)
    VALUES (%s, %s, %s, 2);"""

    cursor.execute(query, (boardId, name, statusId, ))


@connection.connection_handler
def delete_card(cursor, card_id):
    query = """
    DELETE FROM cards
    WHERE id = %s"""

    cursor.execute(query, (card_id, ))


@connection.connection_handler
def get_cardID(cursor, boardID, statusID, title):
    query = """
    SELECT *
    FROM cards
    WHERE board_id = %s AND status_id = %s AND title = %s"""

    cursor.execute(query, (boardID, statusID, title, ))
    return cursor.fetchall()


@connection.connection_handler
def update_card_status(cursor, card_id, status_id):
    query = """
    UPDATE cards
    SET status_id = %s
    WHERE id = %s
    """
    cursor.execute(query, (status_id, card_id, ))


@connection.connection_handler
def add_user(cursor, user_name, password):
    query = """
    INSERT INTO users
    (user_name, password)
    VALUES (%s, %s)"""

    cursor.execute(query, (user_name, password, ))


@connection.connection_handler
def check_user(cursor, user_name):
    query = """
    SELECT password FROM users
    WHERE user_name = %s """

    cursor.execute(query, (user_name, ))
    return cursor.fetchall()


@connection.connection_handler
def update_board_title(cursor, board_id, board_title):
    query = """
    UPDATE boards
    SET title = %s
    WHERE id = %s
    """
    cursor.execute(query, (board_title, board_id, ))


@connection.connection_handler
def update_card_title(cursor, card_id, card_title):
    query = """
    UPDATE cards
    SET title = %s
    WHERE id = %s
    """
    cursor.execute(query, (card_title, card_id, ))


@connection.connection_handler
def delete_board(cursor, board_id):
    query = """
    DELETE FROM cards
    WHERE board_id = %s
    """
    cursor.execute(query, (board_id, ))

    query2 = """
    DELETE FROM boards
    WHERE id = %s
    """
    cursor.execute(query2, (board_id, ))
