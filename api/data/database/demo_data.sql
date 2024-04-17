insert into car_rental.users(user_id, email, full_name, phone_number, date_of_birth, image, hashed_password, role_id,
                             is_email_verified, is_blocked)
values ('257e376a-0142-4cbc-8d64-fc68e6387549', 'carowner@gmail.com', 'Car Owner',
        '123456789', '1990-01-01',
        'example.jpg', '$2a$12$Dwrh3bCxlYiikqZQSRg.4O63T.0CEdJ.4w/uHWGFtfDW7DD5YBS3K', 2, true, false);
insert into car_rental.wallet (wallet_id, user_id, balance)
VALUES ('257e376a-0142-4cbc-8d64-fc68e6387559', '257e376a-0142-4cbc-8d64-fc68e6387549', 10000);
insert into car_rental.users(user_id, email, full_name, phone_number, date_of_birth, image, hashed_password, role_id,
                             is_email_verified, is_blocked)
values ('257e376a-0142-4cbc-8d64-fc68e6387540', 'example@gmail.com', 'Customer',
        '123456789', '1990-01-01',
        'example.jpg', '$2a$12$Dwrh3bCxlYiikqZQSRg.4O63T.0CEdJ.4w/uHWGFtfDW7DD5YBS3K', 1, true, false);
insert into car_rental.wallet (wallet_id, user_id, balance)
VALUES ('257e376a-0142-4cbc-8d64-fc68e6387550', '257e376a-0142-4cbc-8d64-fc68e6387540', 10000);

select now();
select *
from car_rental.rentals