import pyrebase

config = {
    "apiKey": "AIzaSyBRATPG_NkuXG4ekkqbXctO2WLgNC5EoBo",
    "authDomain": "renovationmovies.firebaseapp.com",
    "databaseURL": "https://renovationmovies-default-rtdb.firebaseio.com",
    "storageBucket": "renovationmovies.appspot.com",
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()