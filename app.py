import os
from flask import Flask,request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///FDM.db'
db = SQLAlchemy(app)

class Img(db.Model):
        id = db.Column(db.Integer, unique=True, primary_key=True)
        img = db.Column(db.Text, unique=True,nullable=False)
        name = db.Column(db.Text, nullable=False)
        data_path = db.Column(db.String(), nullable=False)
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
def home():
    return "Hello, Flask!"

@app.route('/products')
def get_products():
    products = Product.query.all()
    output = []
    for product in products:
        product_data = {'User ID': product.userid, 'Name': product.name, 'Price': product.price, 'Colour': product.colour, 'DEscription':product.description}
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
    product = Product(userid=request.json['UserID'],name=request.json['Name'], 
    price=request.json['Price'], colour=request.json['Colour'], description=request.json['Description'],
    category=request.json['Category'])
    db.session.add(product)
    db.session.commit()
    return {'ID': product.id}

@app.route('/upload', methods=['POST'])
def upload():
    pic = request.files['pic']
    if not pic:
        return 'No pic uploaded!', 400

    filename = secure_filename(pic.filename)
    mimetype = pic.mimetype
    if not filename or not mimetype:
        return 'Bad upload!', 400

    img = Img(img=pic.read(), name=filename, mimetype=mimetype)
    db.session.add(img)
    db.session.commit()

    return 'Img Uploaded!', 200

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
