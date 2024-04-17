CREATE OR REPLACE FUNCTION update_last_modified_at()
    RETURNS TRIGGER AS
$$
BEGIN
    new.last_modified_at = timezone('UTC', now());
    RETURN new;
END;
$$
    LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER mdt_cars
    BEFORE UPDATE
    ON car_rental.cars
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();

CREATE OR REPLACE TRIGGER mdt_rentals
    BEFORE UPDATE
    ON car_rental.rentals
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();

CREATE OR REPLACE TRIGGER mdt_ratings
    BEFORE UPDATE
    ON car_rental.ratings
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();