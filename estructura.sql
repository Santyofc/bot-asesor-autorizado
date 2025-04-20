CREATE DATABASE IF NOT EXISTS bot_whatsapp;
USE bot_whatsapp;

CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telefono VARCHAR(20),
    mensaje TEXT,
    respuesta TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);