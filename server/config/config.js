//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Base de datos
let irlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB =
        "mongodb+srv://Huntenatorem:YuFMgtQMriL1JHdc@cluster0-zocby.mongodb.net/cafe";
}

process.env.urlDB = urlDB;