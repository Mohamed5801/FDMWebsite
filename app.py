import os
from flask import Flask, request, jsonify, redirect, url_for, render_template, session, flash
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import json
import urllib.request

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads/'

app.secret_key = "FDM_fcg3_2021"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:FDM_fcg3_2021@localhost/FullStackDev'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Pic(db.Model):
        id = db.Column(db.Integer, unique=True, primary_key=True)
        img = db.Column(db.Text, unique=True,nullable=False)
        name = db.Column(db.Text, nullable=False)
        mimetype = db.Column(db.Text, nullable=False)

class Product(db.Model):
        id = db.Column(db.Integer, unique=True, primary_key=True)
        userid = db.Column(db.String(20), nullable=False) 
        category = db.Column(db.String(50))
        name = db.Column(db.String(80), nullable=False)
        description = db.Column(db.String(120))
        price = db.Column(db.String(20), nullable=False)
        colour = db.Column(db.String(20))
        def __repr__(self):
                return f"{self.userid} - {self.name} - {self.description} - {self.colour} - {self.price}"

class Seller(db.Model):
        userid = db.Column(db.String(20), unique=True,  primary_key=True, nullable=False) 
        password = db.Column(db.String(20))
        name = db.Column(db.String(80), nullable=False)
        picture = db.Column(db.String(10))
        bio = db.Column(db.String(120))
        def __repr__(self):
                return f"{self.userid} - {self.name}"

class Category(db.Model):
        name = db.Column(db.String(80), unique=True, primary_key=True, nullable=False)
        description = db.Column(db.String(120))


@app.route("/")
def index():
    return render_template('Index.html')

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     pic = request.files['pic']
#     if not pic:
#         return 'No pic uploaded!', 400
#     filename = secure_filename(pic.filename)
#     mimetype = pic.mimetype
#     if not filename or not mimetype:
#         return 'Bad upload!', 400
#     img = Pic(img=pic.read(), name=filename, mimetype=mimetype)
#     db.session.add(img)
#     db.session.commit()
#     return 'pic uploaded!', 200

@app.route('/sign_up', methods=["POST", "GET"])
def sign_up():
    if request.method =="POST":
        # session.permanent = True
        password = request.form["password"]
        name = request.form["name"]
        # email = request.form["email"]

        seller = Seller(password=password, name=name, userid=len(Seller.query.all()))
        db.session.add(seller)
        db.session.commit()

        flash("Signed up successfully!")
        return redirect(url_for("login"))
    else:
        if "name" in session:
            flash("Already logged in!")
            return redirect(url_for("name"))
        return render_template("SignUp.html")

@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.permanent = True
        seller = request.form["nm"]
        session["nm"] = seller
        password = request.form["password"]
        session["password"] = password

        found_user = Seller.query.filter_by(name=seller).first()
        if found_user:
            if found_user.password == password:
                session["userid"] = found_user.userid
                session["bio"] = found_user.bio
            else:
                flash("Name or password is incorrect.")
                return redirect(url_for("login"))
        else:
            flash("User not found.")
            return redirect(url_for("login"))

        flash("Logged in successfully!")
        return redirect(url_for("user"))
    else:
        if "user" in session:
            flash("Already logged in!")
            return redirect(url_for("user"))
        return render_template("Login.html")

@app.route('/user', methods=["POST", "GET"])
def user():
    name = None
    userid = None
    password = None
    bio = None
    if "nm" in session:
        nm = session["nm"]

        if request.method == "POST":
            session.permanent = True
            name = request.form["name"]
            session["name"] = name
            password = request.form["password"]
            session["password"] = password
            bio = request.form["bio"]
            session["bio"] = bio
            found_user = Seller.query.filter_by(name=nm).first()
            found_user.name = name
            found_user.password = password
            found_user.bio = bio
            db.session.commit()
            flash("Seller profile info was saved successfully!")
            userid = found_user.userid
            session["nm"] = name
            nm = name
        else:
            if "bio" in session:
                bio = session["bio"]
            if "userid" in session:
                userid = session["userid"]
            if "password" in session:
                password = session["password"]

        return render_template("User.html", name=nm, userid=userid, password=password, bio=bio)
    else:
        flash("You are not logged in!")
        return redirect(url_for("login"))

@app.route("/logout")
def logout():
    flash("You have been logged out!", "info")
    session.pop("name", None)
    session.pop("userid", None)
    session.pop("password", None)
    session.pop("bio", None)
    return redirect(url_for("login"))

@app.route("/home")
def home():
    return render_template("Index.html")
    # return render_template("HomePage.html")

@app.route("/buy")
def buy():
    return render_template("Buy.html")

@app.route("/sell", methods=["POST", "GET"])
def sell():
    if request.method == "POST":
        session.permanent = True
        title = request.form["title"]
        session["title"] = title
        category = request.form["category"]
        session["category"] = category
        description = request.form["description"]
        session["description"] = description
        price = request.form["price"]
        session["price"] = price
        found_user = Seller.query.filter_by(name=session["nm"]).first()
        userid = found_user.userid

        product = Product(id=len(Product.query.all())+1, userid=userid, name=title, category=category, description=description, price=price)
        db.session.add(product)
        db.session.commit()
        flash("New listing was made successfully!")
        return redirect(url_for("load"))
    else:
        print(session)
        return render_template("Sell.html")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/load")
def load():
    return render_template("Upload.html")

@app.route("/upload", methods=["POST"])
def upload():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No image selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # print('upload_image filename: ' + filename)

        pic = Pic(id=len(Pic.query.all()), img="img", name=filename, mimetype="mimetype")
        db.session.add(pic)
        db.session.commit()

        flash('Image successfully uploaded and displayed below')
        return render_template('Upload.html', filename=filename)
    else:
        flash('Allowed image types are - png, jpg, jpeg, gif')
        return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename):
    print('display_image filename: ' + filename)
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

@app.route('/pics')
def get_pics():
    pics = Pic.query.all()
    output = []
    for pic in pics:
        pic_data = {'Filename': pic.name, 'Filetype': pic.mimetype, 'pic':pic.img}
        output.append(pic_data)
    return{"Pics": output}

@app.route('/products')
def get_products():
    products = Product.query.all()
    output = []
    for product in products:
        product_data = {'User_ID': product.userid, 'Name': product.name, 'Price': product.price, 'Colour': product.colour, 'DEscription':product.description}
        output.append(product_data)
    return{"products": output}

@app.route('/sellers')
def get_sellers():
    sellers = Seller.query.all()
    output = []
    for seller in sellers:
        seller_data = {'User ID': seller.userid, 'Name': seller.name}
        output.append(seller_data)
    return{"sellers": output}

@app.route('/Categories')
def get_categories():
    categories = Category.query.all()
    output = []
    for category in categories:
        category_data = {'Name': category.name, 'Description': category.description}
        output.append(category_data)
    return{"categories": output}

@app.route('/products/<id>')
def get_product(id):
    product  = Product.query.get(id)
    return {'User ID': product.userid, 'Name': product.name, 'Price': product.price, 'Colour': product.colour, 'Description':product.description}


@app.route('/sellers/<userid>')
def get_seller(userid):
    sellers  = Seller.query.all()
    for seller in sellers:
        seller_data = {'User ID': seller.userid, 'Name': seller.name}
        if seller.userid == userid:
            return {"seller": seller_data}
    return {"Error":"404"} 

@app.route('/Categories/<name>')
def get_products_by_categories(name):
    category = Category.query.get(name)
    category_data = {'Name': category.name, 'Description': category.description}
    products = Product.query.all()
    output = []
    for product in products:
        product_data = {'Category':product.category, 'User ID': product.userid, 'Name': product.name, 'Price': product.price, 'Colour': product.colour, 'Description':product.description, }
        if product.category == category.name:
            output.append(product_data)
    return{"Categories": category_data, "Products":output}

@app.route('/products', methods=['POST'])
def add_product():
    product = Product(userid=request.json['UserID'],name=request.json['Name'], price=request.json['Price'], colour=request.json['Colour'], description=request.json['Description'],category=request.json['Category'])
    db.session.add(product)
    db.session.commit()
    return {'ID': product.id}

@app.route('/sellers', methods=['POST'])
def add_seller():
    seller = Seller(userid=request.json['UserID'],name=request.json['Name'], password=request.json['Password'])
    db.session.add(seller)
    db.session.commit()
    return {'UserID': seller.userid}

@app.route('/products/<id>', methods=['DELETE'])
def delete_product(id):
    product  = Product.query.get(id)
    if product is None:
        return {"Error":"404"}
    db.session.delete(product)
    db.session.commit()
    return ("Product Number " + id + " has been deleted.")

@app.route('/sellers/<userid>', methods=['DELETE'])
def delete_account(userid):
    sellers  = Seller.query.all()
    for seller in sellers:
        seller_data = {'User ID': seller.userid, 'Name': seller.name}
        if seller.userid == userid:
            db.session.delete(seller)
            db.session.commit()
            return ("Account has been deleted.")
    return {"Error":"404"}


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

