/*
Used to create the database tables.
Run manually with node migration.js
*/

// set up sqlite
const sqlite3 = require('sqlite3');
const testdb = process.env.TEST_DATABASE;
const db = new sqlite3.Database(testdb || './database.sqlite');

// can turn off journalling while we're developing
// change some options for speed while we're developing
db.run('pragma journal_mode=off');
db.run('pragma temp_store = 2');
db.run('pragma SYNCHRONOUS = off');
db.run('PRAGMA foreign_keys = ON');

// run one command after another.  This makes sure dropping the table completes
// before trying to create it again
db.serialize(() => {
  // disable foreign key support so we can drop the table
  db.run('PRAGMA foreign_keys = OFF');
  // ----- First we'll freshen up the current database
  // drop the Employee table
  db.run('DROP TABLE IF EXISTS Employee', (err) => {
    if (err) {
      throw err;
    };
    console.log('Dropped Employee table!');
  });
  // drop the Timesheet table
  db.run('DROP TABLE IF EXISTS Timesheet', (err) => {
    if (err) {
      throw err;
    }
    console.log('Dropped Timesheet table!');
  });
  // drop the Menu table
  db.run('DROP TABLE IF EXISTS Menu', (err) => {
    if (err) {
      throw err;
    }
    console.log('Dropped Menu table!');
  });
  // drop the MenuItem table
  db.run('DROP TABLE IF EXISTS MenuItem', (err) => {
    if (err) {
      throw err;
    }
    console.log('Dropped MenuItem table!');
  });

  // ----- Next we'll create the tables
  // Create the Employee Table
  db.run(`CREATE TABLE Employee (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                position TEXT NOT NULL,
                wage INTEGER NOT NULL,
                is_current_employee INTEGER DEFAULT 1
        )`, (err) => {
    if (err) {
      throw err;
    }
    console.log('Employee table created');
  });
  // Create the Timesheet Table
  db.run(`CREATE TABLE Timesheet (
                id INTEGER PRIMARY KEY NOT NULL,
                hours INTEGER NOT NULL,
                rate INTEGER NOT NULL,
                date INTEGER NOT NULL,
                employee_id INTEGER NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES Employee(id)
        )`, (err) => {
    if (err) {
      throw err;
    }
    console.log('Timesheet table created');
  });
  // create the Menu table
  db.run(`CREATE TABLE Menu (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL
        )`, (err) => {
    if (err) {
      throw err;
    }
    console.log('Menu table created');
  });
  // create MenuItem table
  db.run(`CREATE TABLE MenuItem (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                inventory INTEGER NOT NULL,
                price INTEGER NOT NULL,
                menu_id INTEGER NOT NULL,
                FOREIGN KEY (menu_id) REFERENCES Menu(id)
        )`, (err) => {
    if (err) {
      throw err;
    }
    console.log('MenuItem table created');
  });
});
