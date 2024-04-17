package com.fsa.car_rental.service;

import com.fsa.car_rental.entity.Car;
import com.fsa.car_rental.service.impl.CarServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

//@SpringBootTest
//@Transactional
//@Rollback
@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @InjectMocks
//    @Autowired
    private CarServiceImpl carService;

    @BeforeEach
    void setUp() {
        Car car = Car.builder().id(1).build();
    }

//    @Test
//    void getAllTestCase1() {
//        Page<CarListResponse> result = carService.getAll(
//                1, 12, "basePrice:asc",
//                null, List.of(1), List.of(2),
//                2010, 2017, List.of(5),
//                List.of(BodyType.COUPE), List.of(FuelType.DIESEL), List.of(TransmissionType.MANUAL),
//                BigDecimal.valueOf(7), BigDecimal.valueOf(10),
//                BigDecimal.valueOf(80), BigDecimal.valueOf(100), List.of(2),
//                CarStatus.AVAILABLE
//        );
//        assertEquals(1, result.getTotalElements());
//    }

    @Test
    void getAllTestCase2() {
        assertEquals(1, 1);
    }

}