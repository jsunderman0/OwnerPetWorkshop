const pg = require('pg');
const client = new pg.Client('postgres://localhost/ownerpetworkshop_db');
const express = require('express');
const app = express();
const path = require('path');

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS pets;
    DROP TABLE IF EXISTS owners;
    CREATE TABLE owners(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE
    );
    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      owner_id INT REFERENCES owners(id)
    );
    INSERT INTO owners(name) VALUES('Jack');
    INSERT INTO owners(name) VALUES('Austin');
    INSERT INTO owners(name) VALUES('Akash');
    INSERT INTO owners(name) VALUES('Michael');

    INSERT INTO pets (name, owner_id) VALUES ('Clifford', (SELECT id FROM owners WHERE name='Jack'));
    INSERT INTO pets (name, owner_id) VALUES ('Buddy', (SELECT id FROM owners WHERE name='Jack'));
    INSERT INTO pets (name) VALUES ('Willy');
    INSERT INTO pets (name) VALUES ('Garfield');
  `;
  await client.query(SQL)

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
