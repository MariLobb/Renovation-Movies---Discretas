from flask import Flask, render_template, request, redirect
from firebase_config import auth, db
import pandas as pd
import os
import json
import hashlib

app = Flask(__name__, template_folder="html")


#CARGA DE LOS DATASETS
movies_lista = []
links_lista = []
tags_lista = []

def cargar_JSON_Movies():

    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    ruta_json = os.path.join(base_dir, "movies", "movies.json")

    with open(ruta_json, "r", encoding="utf-8") as file:
        data = json.load(file)

    for item in data:
        movies_lista.append([
            item.get("movieId"),
            item.get("title"),
            item.get("genres")
        ])

    return movies_lista

def cargar_JSON_Links():

    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    ruta_json = os.path.join(base_dir, "movies", "links.json")

    with open(ruta_json, "r", encoding="utf-8") as file:
        data = json.load(file)

    for item in data:
        links_lista.append([
            item.get("movieId"),
            item.get("imdbId"),
            item.get("tmdbId")
        ])

    return links_lista

def cargar_JSON_Tags():

    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    ruta_json = os.path.join(base_dir, "movies", "tags.json")

    with open(ruta_json, "r", encoding="utf-8") as file:
        data = json.load(file)

    for item in data:
        tags_lista.append([
            item.get("userId"),
            item.get("movieId"),
            item.get("tag"),
            item.get("timestamp")
        ])

    return tags_lista
cargar_JSON_Movies()
cargar_JSON_Links()
cargar_JSON_Tags()


#LOGIN Y REGISTER DE LOS USUARIOS
@app.route("/")
@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")


@app.route("/register", methods=["GET"])
def register_page():
    return render_template("register.html")



@app.route("/login", methods=["POST"])
def login_process():
    user = request.form["user"]
    password = request.form["password"]

    try:
        # Obtener usuario desde la BD
        user_db = db.child("usuarios").child(user).get().val()

        if user_db is None:
            return "Usuario no existe"

        # Hash del password ingresado
        hashed_input = hashlib.sha256(password.encode()).hexdigest()

        # Verificar
        if hashed_input == user_db["password"]:
            return f"Bienvenido {user}!"
        else:
            return "Contraseña incorrecta."

    except Exception as e:
        print("ERROR LOGIN:", e)
        return "Error en el login"


@app.route("/register", methods=["POST"])
def register_process():
    user = request.form["user"]
    password = request.form["password"]

    try:
        # HASH DE LA CONTRASEÑA
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Guardar usuario en Realtime Database
        db.child("usuarios").child(user).set({
            "password": hashed_password
        })

        print("USUARIO REGISTRADO:", user)
        return f"Usuario {user} registrado correctamente."

    except Exception as e:
        print("ERROR:", e)
        return "Error registrando: " + str(e)



if __name__ == "__main__":
    app.run(debug=True)
