CREATE DATABASE IF NOT EXISTS quizarena;
USE quizarena;


-- USUÁRIOS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('player', 'host', 'question_admin') DEFAULT 'player',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- PERGUNTAS
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,

    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,

    correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,

    active BOOLEAN DEFAULT TRUE,

    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);


-- SALAS
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(20) NOT NULL UNIQUE,

    host_id INT NOT NULL,

    status ENUM('lobby', 'live', 'finished') DEFAULT 'lobby',

    mode ENUM('normal', 'hardcore') DEFAULT 'normal',

    max_players INT DEFAULT 20,

    time_per_question INT DEFAULT 15,

    is_test BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (host_id) REFERENCES users(id)
);


-- PERGUNTAS DA SALA
-- Guarda o snapshot das perguntas quando a partida começa
CREATE TABLE room_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    room_id INT NOT NULL,
    question_id INT NOT NULL,

    position INT NOT NULL,

    question_text TEXT NOT NULL,

    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,

    correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,

    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),

    UNIQUE (room_id, position)
);


-- JOGADORES DA SALA
CREATE TABLE room_players (
    id INT AUTO_INCREMENT PRIMARY KEY,

    room_id INT NOT NULL,
    user_id INT NOT NULL,

    score INT DEFAULT 0,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id),

    UNIQUE (room_id, user_id)
);


-- RODADAS
CREATE TABLE rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,

    room_id INT NOT NULL,
    room_question_id INT NOT NULL,

    round_number INT NOT NULL,

    status ENUM('open', 'closed') DEFAULT 'open',

    opened_at DATETIME NOT NULL,
    closed_at DATETIME NULL,

    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (room_question_id) REFERENCES room_questions(id),

    UNIQUE (room_id, round_number)
);


-- RESPOSTAS
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    round_id INT NOT NULL,
    user_id INT NOT NULL,

    selected_option ENUM('A', 'B', 'C', 'D') NOT NULL,

    is_correct BOOLEAN NOT NULL,

    points INT DEFAULT 0,

    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (round_id) REFERENCES rounds(id),
    FOREIGN KEY (user_id) REFERENCES users(id),

    UNIQUE (round_id, user_id)
);


-- POWER-UPS
CREATE TABLE powerup_uses (
    id INT AUTO_INCREMENT PRIMARY KEY,

    room_id INT NOT NULL,
    user_id INT NOT NULL,
    round_id INT NOT NULL,

    powerup_type ENUM('5050') NOT NULL,

    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (round_id) REFERENCES rounds(id),

    UNIQUE (room_id, user_id, powerup_type)
);