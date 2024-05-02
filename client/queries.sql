CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  content TEXT NOT NULL,
  image_id INT, 
  creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE images(
  id SERIAL PRIMARY KEY,
  image_path TEXT,
  is_local BOOLEAN NOT NULL 
)
ALTER TABLE articles
ADD COLUMN is_main BOOLEAN DEFAULT FALSE;

CREATE UNIQUE INDEX idx_is_main_true ON articles(is_main) WHERE is_main IS TRUE;
