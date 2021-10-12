from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config['SQL_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)
class Product(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        userid = db.Column(db.String(20), unique=True, nullable=False) 
        name = db.Column(db.String(80), nullable=False)
        description = db.Column(db.String(120))
        price = db.Column(db.String(10), nullable=False)
        colour = db.Column(db.String(20))
        def __repr__(self):
                return f"{self.userid} - {self.name} - {self.description} - {self.colour} - {self.price}"

db.create_all()
p = Product(userid = "M", name="iPhone 12", price = "$5", colour="Navy", description="Brand New")
db.session.add(p)
db.session.add(Product(userid = "O", name="iPhone 11", price = "$5", colour="Gold", description="Brand New"))
db.session.commit()

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

@app.route('/products/<id>')
def get_product(id):
    product  = Product.query.get_or_404(id)
    return {'User ID': product.userid, 'Name': product.name, 'Price': product.price, 'Colour': product.colour, 'DEscription':product.description}

@app.route('/products', methods=['POST'])
def add_product():
    product = Product(userid=request.json['User ID'],name=request.json['Name'], price=request.json['Price'], colour=request.json['Colour'], description=request.json['Description'])
    db.session.add(product)
    db.session.commmit()
    return {'ID': product.id}