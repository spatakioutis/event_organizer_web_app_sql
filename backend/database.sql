CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'past');
CREATE TYPE event_type AS ENUM ('Movies', 'Theater', 'Music', 'Sports');

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    profilePic VARCHAR(255),
    phone VARCHAR(20)
);

CREATE TABLE Events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status event_status NOT NULL,
    type event_type NOT NULL,
    host INT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ticketPrice DECIMAL(10, 2) NOT NULL CHECK (ticketPrice > 0),
    FOREIGN KEY (host) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE EventDates (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    seatsAvailable INT NOT NULL CHECK (seatsAvailable > 0),
    totalSeats INT NOT NULL CHECK (totalSeats > 0),
    FOREIGN KEY (event_id) REFERENCES Events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (event_id, date)
);

CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    bookingDate DATE NOT NULL, 
    numOfTickets INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON UPDATE CASCADE ON DELETE CASCADE
);

