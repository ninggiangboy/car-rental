package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.entity.*;
import com.fsa.car_rental.repository.CarAvailableDateRepository;
import com.fsa.car_rental.repository.CarRepository;
import com.fsa.car_rental.repository.UserRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("${prefix.api}/fake")
@RequiredArgsConstructor
public class FakeController extends BaseController {

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final CarAvailableDateRepository carAvailableDateRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<ResultResponse> fake() {
        Locale locale = new Locale("vi");
        User cus = userRepository.findById(UUID.fromString("257e376a-0142-4cbc-8d64-fc68e6387540")).orElse(null);
        User caro = userRepository.findById(UUID.fromString("257e376a-0142-4cbc-8d64-fc68e6387549")).orElse(null);
        List<String> brands = List.of("Toyota", "Honda", "Mercedes", "BMW", "Audi", "Ford", "Chevrolet", "Hyundai", "Kia", "Mazda");
        List<String> models = List.of("Sedan", "SUV", "Crossover", "Coupe", "Convertible", "Hatchback", "Wagon", "Van", "Truck");
        Faker fakerDate = new Faker(locale);
        IntStream.range(0, 100).forEach(i -> {
            Faker faker = new Faker(locale);
            Car car = Car.builder()
                    .carOwner(caro)
                    .basePrice(BigDecimal.valueOf(faker.number().randomDouble(0, 100, 1000)))
                    .deposit(BigDecimal.valueOf(faker.number().randomDouble(0, 0, 1000)))
                    .createdAt(faker.date().past(365 * 3, TimeUnit.DAYS).toInstant())
                    .color(Color.builder().id(faker.number().numberBetween(1, 12)).build())
                    .model(Model.builder().id(faker.number().numberBetween(1, 100)).build())
                    .features(IntStream.range(1, faker.number().numberBetween(2, 8)).mapToObj(
                            j -> Feature.builder().id(j).build()
                    ).collect(Collectors.toSet()))
                    .fuelConsumption(BigDecimal.valueOf(faker.number().randomDouble(1, 5, 20)))
                    .description(faker.lorem().sentence(100))
                    .termOfUse(faker.lorem().sentence(20))
                    .licensePlate(faker.regexify("[0-9]{2}[A-Z]{1}-[0-9]{4,5}"))
                    .mileage(faker.number().numberBetween(0, 100000))
                    .status(CarStatus.AVAILABLE)
                    .fuelType(faker.options().option(FuelType.class))
                    .transmissionType(faker.options().option(TransmissionType.class))
                    .numberOfSeats(faker.number().numberBetween(2, 8))
                    .year(faker.number().numberBetween(2000, 2022))
                    .location(Location.builder().id("00001").build())
                    .images("https://source.unsplash.com/1600x900/?car-" + brands.get(faker.number().numberBetween(0, brands.size())) + "," +
                            "https://source.unsplash.com/1600x900/?car-" + models.get(faker.number().numberBetween(0, models.size()))
                    )
                    .build();
            Car savedCar = carRepository.save(car);
            CarAvailableDate carAvailableDate = CarAvailableDate.builder()
                    .car(savedCar)
                    .startDate(Instant.now().plus(fakerDate.number().numberBetween(20, 40), ChronoUnit.DAYS))
                    .endDate(Instant.now().plus(fakerDate.number().numberBetween(50, 80), ChronoUnit.DAYS))
                    .build();
            carAvailableDateRepository.save(carAvailableDate);
        });
        return buildResponse("Fake response");
    }
}
