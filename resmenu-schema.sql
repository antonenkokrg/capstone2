CREATE TABLE businesses (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  logo_url TEXT,
  address TEXT
);

CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC CHECK (price > 0.1),
  businesses_id VARCHAR(25) NOT NULL
    REFERENCES businesses ON DELETE CASCADE
);

