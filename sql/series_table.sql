USE TimeSeries;

CREATE TABLE Series (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    value FLOAT NOT NULL
);