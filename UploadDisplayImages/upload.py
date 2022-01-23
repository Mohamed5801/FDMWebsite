from flask import Flask, flash, request, redirect, url_for, render_template
import urllib.request
import os
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

class Seller(db.Model):
        userid = db.Column(db.String(20), unique=True,  primary_key=True, nullable=False) 
        password = db.Column(db.String(20))
        name = db.Column(db.String(80), nullable=False)
        picture = db.Column(db.String(10))
        bio = db.Column(db.String(120))
        def __repr__(self):
                return f"{self.userid} - {self.name}"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
 
@app.route('/sellers/<userid>')
def get_seller(userid):
    sellers  = Seller.query.all()
    for seller in sellers:
        seller_data = {'User ID': seller.userid, 'Name': seller.name}
        if seller.userid == userid:
            return {"seller": seller_data}
    return {"Error":"404"} 