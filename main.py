from flask import Flask, render_template, url_for, jsonify, request, redirect, flash, session
from util import json_response
import data_handler
import password_manager


app = Flask(__name__)
app.secret_key = "secret"

# ================================================================================================
@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    user_name = None
    if 'user_name' in session:
        user_name = session['user_name']

    return render_template('index.html', user_name=user_name)

# ================================================================================================
@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    if 'user_name' in session:
        user_name = session['user_name']
        return data_handler.get_user_and_public_boards(user_name)

    return data_handler.get_boards()

# ================================================================================================
@app.route("/get-cards")
@json_response
def get_cards():
    return data_handler.get_all_cards()

# ================================================================================================
@app.route("/get-board/<title>")
@json_response
def get_single_board(title):

    return data_handler.get_one_board(title)

# ================================================================================================
@app.route("/get-statuses")
@json_response
def get_statuses():

    return data_handler.get_all_statuses()

# ================================================================================================
@app.route("/get-card", methods=['GET', 'POST'])
@json_response
def create_card():
    if request.method == 'POST':
        data = request.json
        data_handler.add_card(data['boardId'], data['status'], data['name'])

# ================================================================================================
@app.route("/new-board", methods=['GET', 'POST'])
@json_response
def new_board():
    if request.method == 'POST':
        data = request.json
        if 'user_name' in session:
            user_name = session['user_name']
            data_handler.add_board_for_user(user_name, data['title'])
        else:
            data_handler.add_board(data['title'])

# ================================================================================================
@app.route("/delete-card/<int:card_id>", methods=['GET', 'POST'])
@json_response
def delete_card(card_id):
    if request.method == 'POST':
        data = request.json
        data_handler.delete_card(data['card_id'])

# ================================================================================================
@app.route('/get-cardID/<int:boardID>/<int:statusID>/<title>')
@json_response
def get_cardID(boardID, statusID, title):

    return data_handler.get_cardID(boardID, statusID, title)

# ================================================================================================
@app.route("/update-card-status", methods=['GET', 'POST'])
@json_response
def update_card_status():
    if request.method == 'POST':
        data = request.json
        data_handler.update_card_status(data['card_id'], data['status_id'])

# ================================================================================================
@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user_name = request.form.get('email')
        password = request.form.get('password')
        password_repeat = request.form.get('password-repeat')
        check_if_user_exist = data_handler.check_user(user_name)
        if not check_if_user_exist:
            if password == password_repeat:
                hashed_password = password_manager.hash_password(password)
                data_handler.add_user(user_name, hashed_password)
                return redirect('/login')
            else:
                flash('  The Password Does Not Match!!   ')
                return redirect(url_for("register"))
        else:
            flash('  Please Choose Another Username!  ')

    return render_template("registration.html")

# ================================================================================================
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_name = request.form.get('email')
        password = request.form.get('password')
        return_password_if_user_exists = data_handler.check_user(user_name)
        if return_password_if_user_exists:
            if password_manager.verify_password(password, return_password_if_user_exists[0]['password']):
                session['user_name'] = user_name
                return redirect('/')
            else:
                flash("Username or Password incorect!")
        else:
            flash("Username or Password incorect!")

    return render_template("login.html")

# ================================================================================================
@app.route("/logout")
def logout():
    session.pop('user_name', None)
    return redirect('/')

# ================================================================================================
@app.route("/update-board-title", methods=['GET', 'POST'])
@json_response
def update_board_title():
    if request.method == 'POST':
        data = request.json
        data_handler.update_board_title(data['board_id'], data['board_title'])

# ================================================================================================
@app.route("/update-card-title", methods=['GET', 'POST'])
@json_response
def update_card_title():
    if request.method == 'POST':
        data = request.json
        data_handler.update_card_title(data['card_id'], data['card_title'])
# ================================================================================================
@app.route('/delete-board', methods=['GET', 'POST'])
@json_response
def detele_board():
    if request.method == 'POST':
        data = request.json
        data_handler.delete_board(data["board_id"])

# ================================================================================================
def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule(
            '/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))

# ================================================================================================
if __name__ == '__main__':
    main()
