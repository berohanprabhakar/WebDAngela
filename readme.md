CRATE TABLE student(
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    latname TEXT,
);

// foreign key

CREATE TABLE contact_detail(
    id INTEGER REFERENCES student(id) UNIQUE,
    tel TEXT,
    address TEXT,
);