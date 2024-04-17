package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.base.BaseSpecification;
import com.fsa.car_rental.constant.car.CarStatus;
import com.fsa.car_rental.constant.car.FuelType;
import com.fsa.car_rental.constant.car.TransmissionType;
import com.fsa.car_rental.constant.rental.RentalStatus;
import com.fsa.car_rental.dto.base.SearchCriterion;
import com.fsa.car_rental.dto.car.CarAvailableResponse;
import com.fsa.car_rental.dto.car.CarDetailResponse;
import com.fsa.car_rental.dto.car.CarListResponse;
import com.fsa.car_rental.dto.car.CarRatingResponse;
import com.fsa.car_rental.dto.location.LocationWithPathResponse;
import com.fsa.car_rental.dto.rent.BookingListRecord;
import com.fsa.car_rental.dto.rent.RecentRentResponse;
import com.fsa.car_rental.dto.rent.RevenueResponse;
import com.fsa.car_rental.entity.*;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.projection.CarProjection;
import com.fsa.car_rental.repository.CarAvailableDateRepository;
import com.fsa.car_rental.repository.CarRepository;
import com.fsa.car_rental.repository.RentalRepository;
import com.fsa.car_rental.repository.UserRepository;
import com.fsa.car_rental.service.CarService;
import com.fsa.car_rental.service.LocationService;
import com.fsa.car_rental.validation.CarValidator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.sql.Timestamp;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.fsa.car_rental.dto.base.SearchCriterion.Operation.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarServiceImpl implements CarService {
    private static final Sort.Direction directionDefault = Sort.Direction.DESC;
    private final ModelMapper modelMapper;
    private final EntityManager em;
    private final LocationService locationService;
    private final UserRepository userRepository;
    private final RentalRepository rentalRepository;
    private final CarRepository carRepository;
    private final CarValidator carValidator;
    private final RedisTemplate<String, Object> redisTemplate;
    private final CarAvailableDateRepository carAvailableDateRepository;
    private final ModelMapper mapper;

    @Override
    public Page<CarListResponse> getAll(
            int page, int size,
            List<String> sort,
            String location,
            List<Integer> brandIds,
            List<Integer> colorIds,
            Integer minYear, Integer maxYear,
            List<Integer> numberOfSeats,
            List<FuelType> fuels,
            List<TransmissionType> transmissions,
            BigDecimal minFuelConsumption, BigDecimal maxFuelConsumption,
            BigDecimal minPrice, BigDecimal maxPrice,
            String isNonDepositPaid,
            List<Integer> featureIds,
            CarStatus status,
            Instant start,
            Instant end) {
        carValidator.validate(page, size, minYear, maxYear, numberOfSeats, minFuelConsumption, maxFuelConsumption,
                minPrice, maxPrice, isNonDepositPaid);
        List<String> locationChild = locationService.getLocationsChildIds(location);
        locationChild.add(location);
        BaseSpecification<Car> spec = new BaseSpecification<>();
        spec.where(IN, Car.Fields.location,
                locationChild.stream().map(id -> Location.builder().id(id).build()).toList(),
                location != null && !location.isEmpty());
        if (start != null && end != null) {
            List<Integer> availableDateCarIds = carAvailableDateRepository.findCarIdByStartDateBeforeAndEndDateAfter(
                    start.minus(1, ChronoUnit.DAYS), end.plus(1, ChronoUnit.DAYS));
            spec.and(IN, Car.Fields.id, availableDateCarIds, true);
        }
        spec.and(IN, Model.Fields.brand,
                brandIds == null ? null : brandIds.stream().map(id -> Brand.builder().id(id).build()).toList(),
                Car.Fields.model, brandIds != null && !brandIds.isEmpty());
        spec.and(IN, Car.Fields.color,
                colorIds == null ? null : colorIds.stream().map(id -> Color.builder().id(id).build()).toList(),
                colorIds != null && !colorIds.isEmpty());
        spec.and(GREATER_THAN_EQUAL, Car.Fields.year, minYear, minYear != null);
        spec.and(LESS_THAN_EQUAL, Car.Fields.year, maxYear, maxYear != null);
        spec.and(IN, Car.Fields.numberOfSeats, numberOfSeats,
                numberOfSeats != null && !numberOfSeats.isEmpty() && !numberOfSeats.contains(7));
        spec.and(GREATER_THAN_EQUAL, Car.Fields.numberOfSeats, 7,
                numberOfSeats != null && !numberOfSeats.isEmpty() && numberOfSeats.contains(7));
        spec.and(IN, Car.Fields.fuelType, fuels, fuels != null && !fuels.isEmpty() && fuels.size() != 2);
        spec.and(IN, Car.Fields.transmissionType, transmissions, transmissions != null && !transmissions.isEmpty());
        spec.and(GREATER_THAN_EQUAL, Car.Fields.fuelConsumption, minFuelConsumption, minFuelConsumption != null);
        spec.and(LESS_THAN_EQUAL, Car.Fields.fuelConsumption, maxFuelConsumption, maxFuelConsumption != null);
        spec.and(GREATER_THAN_EQUAL, Car.Fields.basePrice, minPrice, minPrice != null);
        spec.and(LESS_THAN_EQUAL, Car.Fields.basePrice, maxPrice, maxPrice != null);
        spec.and(EQUAL, Car.Fields.deposit, 0, isNonDepositPaid != null && isNonDepositPaid.equalsIgnoreCase("true"));
        spec.and(IN, Feature.Fields.id, featureIds, Car.Fields.features, featureIds != null && !featureIds.isEmpty());
        spec.and(EQUAL, Car.Fields.status, CarStatus.AVAILABLE, true);
        Pageable pageable = PageRequest.of(page - 1, size, getCarSort(sort));
        List<CarListResponse> cars = findAllBy(pageable, spec);
        Long total = getTotalBy(spec);
        return new PageImpl<>(cars, pageable, total);
    }

    @Override
    public Page<CarListResponse> getAll(UUID id, int page, int size, List<String> sort, CarStatus status) {
        var spec = new BaseSpecification<Car>();
        spec.and(EQUAL, Car.Fields.status, status, status != null);
        spec.where(EQUAL, Car.Fields.carOwner, User.builder().id(id).build(), true);
        var pageable = PageRequest.of(page - 1, size, getCarSort(sort));
        var cars = findAllBy(pageable, spec);
        var total = getTotalBy(spec);
        return new PageImpl<>(cars, pageable, total);
    }

    @Override
    public List<CarAvailableResponse> getAvailableDateList(Integer id) {
        return carAvailableDateRepository.findByCarId(id)
                .stream().map((element) -> modelMapper.map(element, CarAvailableResponse.class))
                .toList();
    }

    private Long getTotal(Specification<Car> spec) {
        String key = "numOfTotal::" + spec.toString();
        return Optional.ofNullable(redisTemplate.opsForValue().get(key)).map(o -> Long.valueOf((Integer) o))
                .orElseGet(() -> {
                    Long result = getTotalBy(spec);
                    redisTemplate.opsForValue().set(key, result);
                    redisTemplate.expire(key, 7, TimeUnit.DAYS);
                    return result;
                });
    }

    private List<CarListResponse> findAll(Pageable pageable, Specification<Car> spec) {
        String key = "cars::" + pageable.getPageNumber() + "::" + pageable.getPageSize() + spec.toString()
                + pageable.getSort();
        return Optional.ofNullable(redisTemplate.opsForValue().get(key)).map(o -> (List<CarListResponse>) o)
                .orElseGet(() -> {
                    List<CarListResponse> cars = findAllBy(pageable, spec);
                    redisTemplate.opsForValue().set(key, cars);
                    redisTemplate.expire(key, 7, TimeUnit.DAYS);
                    return cars;
                });
    }

    private Long getTotalBy(Specification<Car> spec) {
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<Car> countRoot = countQuery.from(Car.class);
        countQuery.select(builder.count(countRoot));
        countQuery.where(spec.toPredicate(countRoot, countQuery, builder));
        return em.createQuery(countQuery).getSingleResult();
    }

    private List<CarListResponse> findAllBy(Pageable pageable, Specification<Car> spec) {
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<CarListResponse> query = builder.createQuery(CarListResponse.class);
        Root<Car> root = query.from(Car.class);
        Join<Car, Model> modelJoin = root.join(Car.Fields.model);
        Join<Model, Brand> brandJoin = modelJoin.join(Model.Fields.brand);
        Join<Car, Rental> rentalJoin = root.join(Car.Fields.rentals, JoinType.LEFT);
        Join<Rental, Rating> ratingJoin = rentalJoin.join(Rental.Fields.rating, JoinType.LEFT);
        CriteriaQuery<CarListResponse> select = query.select(
                builder.construct(
                        CarListResponse.class,
                        root.get(Car.Fields.id),
                        brandJoin.get(Brand.Fields.name),
                        modelJoin.get(Model.Fields.name),
                        root.get(Car.Fields.year),
                        root.get(Car.Fields.basePrice),
                        root.get(Car.Fields.images),
                        root.get(Car.Fields.location).get(Location.Fields.id),
                        root.get(Car.Fields.deposit),
                        root.get(Car.Fields.numberOfSeats),
                        root.get(Car.Fields.transmissionType),
                        root.get(Car.Fields.fuelType),
                        builder.count(rentalJoin.get(Rental.Fields.id)),
                        builder.coalesce(builder.avg(ratingJoin.get(Rating.Fields.rating)), 0.0),
                        root.get(Car.Fields.fuelConsumption),
                        root.get(Car.Fields.mileage),
                        root.get(Car.Fields.status)));
        select.where(spec.toPredicate(root, query, builder));
        List<Order> orderList = new ArrayList<>();
        for (Sort.Order order : pageable.getSort()) {
            String property = order.getProperty();
            if (property.contains("rating")) {
                Expression<Double> avgRating = builder
                        .function("ROUND", Double.class, builder.avg(ratingJoin.get(Rating.Fields.rating)),
                                builder.literal(1));
                orderList.add(order.isAscending()
                        ? builder.asc(builder.coalesce(avgRating, 0.0))
                        : builder.desc(builder.coalesce(avgRating, 0.0)));
                continue;
            }
            orderList.add(order.isAscending() ? builder.asc(root.get(property)) : builder.desc(root.get(property)));
        }
        select.groupBy(
                root.get(Car.Fields.id),
                brandJoin.get(Brand.Fields.name),
                modelJoin.get(Model.Fields.name),
                root.get(Car.Fields.year),
                root.get(Car.Fields.basePrice),
                root.get(Car.Fields.images),
                root.get(Car.Fields.location).get(Location.Fields.id),
                root.get(Car.Fields.deposit),
                root.get(Car.Fields.numberOfSeats),
                root.get(Car.Fields.transmissionType),
                root.get(Car.Fields.fuelType),
                root.get(Car.Fields.fuelConsumption),
                root.get(Car.Fields.mileage));
        select.orderBy(orderList);
        TypedQuery<CarListResponse> typed = em.createQuery(select);
        typed.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typed.setMaxResults(pageable.getPageSize());
        List<CarListResponse> cars = typed.getResultList();
        setLocation(cars);
        return new ArrayList<>(cars);
    }

    private void setLocation(List<CarListResponse> cars) {
        List<String> locationIds = cars.stream().map(CarListResponse::getLocation).toList();
        List<LocationWithPathResponse> locations = locationService.getLocationsWithPath(locationIds);

        Map<String, String> locationMap = locations.stream()
                .collect(Collectors.toMap(LocationWithPathResponse::getId, LocationWithPathResponse::getPath));

        for (CarListResponse car : cars) {
            String locationId = car.getLocation();
            if (locationMap.containsKey(locationId)) {
                car.setLocation(locationMap.get(locationId));
            }
        }
    }

    private Sort getCarSort(List<String> sortList) {
        List<Sort.Order> orders = new ArrayList<>();

        if (sortList == null || sortList.isEmpty()) {
            return Sort.unsorted();
        }

        for (String sort : sortList) {
            String[] sortArr = sort.split(":");
            Sort.Direction direction;

            if (sortArr.length != 2) {
                direction = directionDefault;
            } else {
                try {
                    direction = Sort.Direction.fromString(sortArr[1]);
                } catch (IllegalArgumentException e) {
                    direction = directionDefault;
                }
            }

            Sort.Order order = new Sort.Order(direction, sortArr[0]);
            orders.add(order);
        }

        return Sort.by(orders);
    }

    @Override
    @Transactional
    public CarDetailResponse getCarDetail(Integer carId) {
        return mapToCarDetailResponse(carRepository.findById(carId, CarProjection.class).orElseThrow(
                () -> new NotFoundException("Car not found")));
    }

    private CarDetailResponse mapToCarDetailResponse(CarProjection car) {
        CarDetailResponse result = mapper.map(car, CarDetailResponse.class);
        result.setFeatureNames(
                car.getFeatures().stream().map(CarProjection.FeatureInfo::getName).collect(Collectors.toSet()));
        result.setModelName(car.getModel().getName());
        result.setBrandName(car.getModel().getBrand().getName());
        result.setColorName(car.getColor().getName());
        result.setImages(List.of(car.getImages().split(",")));
        result.setCarOwnerId(car.getCarOwner().getId().toString());
        result.setLocation(locationService.getLocationWithPathById(car.getLocation().getId()).getPath());
        result.setCreatedAt(car.getCreatedAt());
        Tuple avgAndRide = carRepository.findAvgAndRide(car.getId());
        Double d = (avgAndRide.get(0) == null) ? 0.0 : Double.parseDouble(avgAndRide.get(0).toString());
        result.setRating(d);
        result.setNumberOfRides((Long) avgAndRide.get(1));
        return result;
    }

    @Override
    @Transactional
    public Page<CarRatingResponse> getCarRating(Integer carId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Tuple> tupleResults = carRepository.getCarRating(carId, pageable);
        return tupleResults.map(tuple -> CarRatingResponse.builder()
                .fullName(tuple.get("full_name", String.class))
                .image(tuple.get("image", String.class))
                .comment(tuple.get("comment", String.class))
                .rating(tuple.get("rating", Integer.class))
                .createdAt(tuple.get("created_at", Timestamp.class).toInstant())
                .build());
    }

    @Override
    public List<CarListResponse> referenceList(Integer carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new NotFoundException("Car not found"));
        List<Location> location = locationService.findPath(car.getLocation().getId());
        String parent = location.get(1).getId();
        List<String> locationChild = locationService.getLocationsChildIds(parent);
        BaseSpecification<Car> spec = specCar(carId, car, locationChild, GREATER_THAN_EQUAL);
        BaseSpecification<Car> spec1 = specCar(carId, car, locationChild, LESS_THAN);
        Pageable pageable = PageRequest.of(0, 4, Sort.by(Sort.Order.asc(Car.Fields.basePrice)));
        Pageable pageable1 = PageRequest.of(0, 4, Sort.by(Sort.Order.desc(Car.Fields.basePrice)));
        List<CarListResponse> listGreater = findAllBy(pageable, spec);
        List<CarListResponse> listLesser = findAllBy(pageable1, spec1);
        listGreater.addAll(listLesser);
        listGreater = listGreater.stream()
                .sorted(Comparator.comparing(o -> o.getBasePrice().subtract(car.getBasePrice()).abs())).toList();
        return listGreater.subList(0, Math.min(4, listGreater.size()));
    }

    private BaseSpecification<Car> specCar(Integer carId, Car car, List<String> locationChild,
            SearchCriterion.Operation operation) {
        BaseSpecification<Car> spec = new BaseSpecification<>();
        spec.and(NOT_EQUAL, Car.Fields.id, carId, true);
        spec.and(IN, Car.Fields.location, locationChild.stream().map(id -> Location.builder().id(id).build()).toList(),
                true);
        spec.and(operation, Car.Fields.basePrice, car.getBasePrice(), true);
        return spec;
    }

    @Override
    public Page<BookingListRecord> getBookingHistoryCar(
            User user,
            Integer carId,
            List<RentalStatus> status,
            int page, int size,
            List<Integer> rating,
            String sort) {
        carRepository.findByIdAndCarOwner(carId, user)
                .orElseThrow(() -> new NotFoundException("Car not found"));
        Sort sortField = Sort.by(Sort.Direction.valueOf(sort.toUpperCase()), Rental.Fields.createdAt);
        Pageable pageable = PageRequest.of(page - 1, size, sortField);
        return carRepository.bookingHistory(carId, status, rating, pageable);
    }

    @Override
    public void changeStatus(User user, Integer id) {
        Car car = carRepository.findByIdAndCarOwner(id, user)
                .orElseThrow(() -> new NotFoundException("Car not found"));
        car.setStatus(car.getStatus() == CarStatus.AVAILABLE ? CarStatus.UNAVAILABLE : CarStatus.AVAILABLE);
        carRepository.save(car);
    }

    @Override
    public RevenueResponse getCarRevenue(User user, Integer id) {
        carRepository.findByIdAndCarOwner(id, user)
                .orElseThrow(() -> new NotFoundException("Car not found"));
        Tuple totalInfo = rentalRepository.findCarRentalInfo(user.getId(), id);
        BigDecimal currentMonthRev = totalInfo.get(0, BigDecimal.class) != null
                ? totalInfo.get(0, BigDecimal.class)
                : null;

        BigDecimal previousMonthRev = totalInfo.get(1, BigDecimal.class) != null
                ? totalInfo.get(1, BigDecimal.class)
                : null;

        BigDecimal totalRev = totalInfo.get(2, BigDecimal.class) != null
                ? totalInfo.get(2, BigDecimal.class)
                : null;
        Double growthRev = (previousMonthRev == null || previousMonthRev.equals(BigDecimal.valueOf(0))) ? null
                : ((currentMonthRev.subtract(previousMonthRev)).divide(previousMonthRev, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue());
        Double avgRating = totalInfo.get(3, BigDecimal.class) != null
                ? totalInfo.get(3, BigDecimal.class).doubleValue()
                : null;

        Long totalRide = totalInfo.get(4, Long.class);

        return RevenueResponse.builder()
                .monthRevenue(RevenueResponse.Revenue.builder()
                        .previousMonthRevenue(previousMonthRev)
                        .currentMonthRevenue(currentMonthRev)
                        .growthRevenueRate(growthRev).build())
                .totalRevenue(totalRev)
                .avgRating(avgRating)
                .totalRides(totalRide).build();
    }

    @Override
    public List<CarListResponse> getUserCarsBooked(UUID userId) {
        var carIds = rentalRepository.findCarIdsByRenter_Id(userId);
        var spec = new BaseSpecification<Car>();
        spec.where(IN, Car.Fields.id, carIds, true);
        return findAllBy(PageRequest.of(0, 10), spec);
    }

    @Override
    public List<RecentRentResponse> getRecentRental(UUID userId) {
        List<Tuple> tuples = rentalRepository.findRecentRent(userId);
        List<RecentRentResponse> recentRents = new ArrayList<>();

        for (Tuple tuple : tuples) {
            RecentRentResponse recentRent = new RecentRentResponse();
            recentRent.setCarId(tuple.get(0, Integer.class));
            recentRent.setRentalId(tuple.get(1, Integer.class));
            recentRent.setCarName(tuple.get(2, String.class));
            // recentRent.setCarImage(tuple.get(3, String.class));
            String carImages = tuple.get(3, String.class);
            String firstImageLink = carImages.split(",")[0].trim();
            recentRent.setCarImage(firstImageLink);
            recentRent.setLastModified(tuple.get(4, Instant.class));
            recentRent.setStartDate(tuple.get(5, Instant.class));
            recentRent.setEndDate(tuple.get(6, Instant.class));
            recentRent.setStatus(tuple.get(7, RentalStatus.class));
            recentRent.setNumberOfPending(tuple.get(8, Long.class).intValue());
            recentRents.add(recentRent);
        }
        return recentRents;
    }
}
