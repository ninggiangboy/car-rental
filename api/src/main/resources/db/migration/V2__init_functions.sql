CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "unaccent";

CREATE OR REPLACE FUNCTION update_last_modified_at()
    RETURNS TRIGGER AS
$$
BEGIN
    new.last_modified_at = now();
    RETURN new;
END;
$$
    LANGUAGE plpgsql;


CREATE TRIGGER mdt_cars
    BEFORE UPDATE
    ON car_rental.cars
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();

CREATE TRIGGER mdt_rentals
    BEFORE UPDATE
    ON car_rental.rentals
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();

CREATE TRIGGER mdt_ratings
    BEFORE UPDATE
    ON car_rental.ratings
    FOR EACH ROW
EXECUTE PROCEDURE update_last_modified_at();

CREATE OR REPLACE FUNCTION slugify("value" TEXT)
    RETURNS TEXT AS
$$
WITH "unaccented" AS (SELECT unaccent("value") AS "value"),
     "lowercase" AS (SELECT lower("value") AS "value" FROM "unaccented"),
     "removed_quotes" AS (SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value" FROM "lowercase"),
     "hyphenated" AS (SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value" FROM "removed_quotes"),
     "trimmed" AS (SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') AS "value" FROM "hyphenated")
SELECT "value"
FROM "trimmed";
$$ LANGUAGE SQL STRICT
                IMMUTABLE;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 5)
WHERE slug LIKE 'quan-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 7)
WHERE slug LIKE 'phuong-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 7)
WHERE slug LIKE 'thanh-pho-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 5)
WHERE slug LIKE 'tinh-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 7)
WHERE slug LIKE 'thi-xa-%'
  AND LENGTH(slug) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 9)
WHERE slug LIKE 'thi-tran-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 6)
WHERE slug LIKE 'huyen-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;

UPDATE car_rental.locations
SET slug = RIGHT(slug, LENGTH(slug) - 3)
WHERE slug LIKE 'xa-%'
  AND LENGTH(RIGHT(slug, LENGTH(slug) - 5)) > 3;