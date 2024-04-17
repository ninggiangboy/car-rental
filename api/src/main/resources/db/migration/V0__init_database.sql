DROP SCHEMA if EXISTS car_rental CASCADE;
CREATE SCHEMA car_rental;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS car_rental.roles
(
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS car_rental.users
(
    user_id           UUID PRIMARY KEY             DEFAULT uuid_generate_v4(),
    email             VARCHAR(100) UNIQUE NOT NULL,
    full_name         VARCHAR(100)        NOT NULL,
    phone_number      VARCHAR(20)         NOT NULL,
    national_id       VARCHAR(20)                  DEFAULT NULL,
    driver_license    TEXT                         DEFAULT NULL,
    date_of_birth     DATE                         DEFAULT NULL,
    image             TEXT                         DEFAULT NULL,
    hashed_password   VARCHAR(255)        NOT NULL,
    role_id           INTEGER             NOT NULL,
    is_email_verified BOOLEAN             NOT NULL DEFAULT FALSE,
    is_blocked        BOOLEAN             NOT NULL DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES car_rental.roles (role_id)
);

CREATE TABLE IF NOT EXISTS car_rental.brands
(
    brand_id   SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS car_rental.models
(
    model_id   SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    brand_id   INTEGER      NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES car_rental.brands (brand_id)
);

CREATE TABLE IF NOT EXISTS car_rental.colors
(
    color_id   SERIAL PRIMARY KEY,
    color_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS car_rental.locations
(
    location_id    VARCHAR(10) PRIMARY KEY,
    location_name  VARCHAR(100) NOT NULL,
    location_level INTEGER DEFAULT 1,
    left_index     INTEGER,
    right_index    INTEGER,
    slug           VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS car_rental.cars
(
    car_id            SERIAL PRIMARY KEY,
    license_plate     VARCHAR(100)   NOT NULL,
    model_id          INTEGER        NOT NULL,
    color_id          INTEGER        NOT NULL,
    car_year          INTEGER        NOT NULL,
    number_of_seats   INTEGER        NOT NULL,
    transmission_type TEXT           NOT NULL,
    fuel_type         TEXT           NOT NULL,
    mileage           INTEGER        NOT NULL,
    fuel_consumption  DECIMAL(10, 2) NOT NULL,
    base_price        DECIMAL(10, 2) NOT NULL,
    deposit           DECIMAL(10, 2)          DEFAULT 0,
    car_description   TEXT,
    car_status        TEXT           NOT NULL DEFAULT 'AVAILABLE',
    car_image         TEXT,
    term_of_use       TEXT,
    car_owner_id      UUID           NOT NULL,
    location_id       VARCHAR(10)    NOT NULL,
    created_at        TIMESTAMP               DEFAULT now(),
    last_modified_at  TIMESTAMP               DEFAULT now(),
    CHECK ( car_status IN ('AVAILABLE', 'UNAVAILABLE') ),
    CHECK ( transmission_type IN ('MANUAL', 'AUTOMATIC') ),
    CHECK ( fuel_type IN ('GASOLINE', 'DIESEL', 'ELECTRIC') ),
    FOREIGN KEY (car_owner_id) REFERENCES car_rental.users (user_id),
    FOREIGN KEY (model_id) REFERENCES car_rental.models (model_id),
    FOREIGN KEY (color_id) REFERENCES car_rental.colors (color_id),
    FOREIGN KEY (location_id) REFERENCES car_rental.locations (location_id)
);

CREATE TABLE IF NOT EXISTS car_rental.features
(
    feature_id   SERIAL PRIMARY KEY,
    feature_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS car_rental.car_features
(
    car_id     INTEGER NOT NULL,
    feature_id INTEGER NOT NULL,
    FOREIGN KEY (car_id) REFERENCES car_rental.cars (car_id),
    FOREIGN KEY (feature_id) REFERENCES car_rental.features (feature_id)
);

CREATE TABLE IF NOT EXISTS car_rental.car_available_dates
(
    available_date_id SERIAL PRIMARY KEY,
    car_id            INTEGER   NOT NULL,
    start_date        TIMESTAMP NOT NULL,
    end_date          TIMESTAMP NOT NULL,
    FOREIGN KEY (car_id) REFERENCES car_rental.cars (car_id)
);

CREATE TABLE IF NOT EXISTS car_rental.rental_person
(
    id             SERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    phone          TEXT NOT NULL,
    national_id    TEXT NOT NULL,
    license_driver TEXT
);

--Create table rentals
CREATE TABLE IF NOT EXISTS car_rental.rentals
(
    rental_id        SERIAL PRIMARY KEY,
    car_id           INTEGER        NOT NULL,
    renter_id        UUID           NOT NULL,
    rental_start     TIMESTAMP      NOT NULL,
    rental_end       TIMESTAMP      NOT NULL,
    total_price      DECIMAL(10, 2) NOT NULL,
    deposit          DECIMAL(10, 2) NOT NULL,
    rental_status    TEXT           NOT NULL DEFAULT 'PENDING',
    driver           INTEGER,
    renter           INTEGER        NOT NULL,
    created_at       TIMESTAMP               DEFAULT now(),
    last_modified_at TIMESTAMP               DEFAULT now(),
    FOREIGN KEY (car_id) REFERENCES car_rental.cars (car_id),
    FOREIGN KEY (renter_id) REFERENCES car_rental.users (user_id),
    FOREIGN KEY (driver) REFERENCES car_rental.rental_person (id),
    FOREIGN KEY (renter) REFERENCES car_rental.rental_person (id),
    CHECK (rental_status IN ('PENDING', 'REJECTED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED',
                             'PENDING_DEPOSIT', 'PENDING_PICKUP', 'PENDING_PAYMENT', 'PENDING_CONFIRM_PAYMENT')
        )
);

--Create table ratings
CREATE TABLE IF NOT EXISTS car_rental.ratings
(
    rating_id        SERIAL PRIMARY KEY,
    rental_id        INTEGER NOT NULL,
    rating           INTEGER NOT NULL,
    comment          TEXT,
    created_at       TIMESTAMP DEFAULT now(),
    last_modified_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (rental_id) REFERENCES car_rental.rentals (rental_id),
    CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE IF NOT EXISTS car_rental.wallet
(
    wallet_id UUID PRIMARY KEY        DEFAULT uuid_generate_v4(),
    user_id   UUID           NOT NULL,
    balance   DECIMAL(20, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES car_rental.users (user_id)
);

CREATE TABLE IF NOT EXISTS car_rental.transactions
(
    transaction_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID           NOT NULL,
    amount             DECIMAL(20, 2) NOT NULL CHECK (amount > 0),
    payment_method     TEXT           NOT NULL,
    transaction_type   TEXT           NOT NULL,
    transaction_desc   TEXT,
    transaction_code   TEXT           NOT NULL,
    transaction_status TEXT           NOT NULL,
    created_at         TIMESTAMP        DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES car_rental.users (user_id),
    CHECK (transaction_type IN
           ('TOP_UP', 'PAY_DEPOSIT', 'RECEIVE_DEPOSIT', 'WITHDRAWAL', 'PAY_RENT', 'RECEIVE_RENT', 'REFUND_DEPOSIT',
            'RECEIVE_REFUND')
        ),
    CHECK (payment_method IN ('WALLET', 'CASH')),
    CHECK (transaction_status IN ('PENDING', 'COMPLETED', 'FAILED'))
);
