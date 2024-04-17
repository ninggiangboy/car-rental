package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.location.LocationWithPathResponse;
import com.fsa.car_rental.entity.Location;
import com.fsa.car_rental.exception.NotFoundException;
import com.fsa.car_rental.repository.LocationRepository;
import com.fsa.car_rental.service.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    @Transactional
    @Override
    public List<LocationWithPathResponse> search(String name) {
        List<String> inputs = Arrays.asList(name.split("\\s*,\\s*"));
        Collections.reverse(inputs);
        inputs = inputs.subList(0, Math.min(3, inputs.size()));
        List<Integer> highestLevels = List.of(1, 2, 3).subList(0, 4 - inputs.size());
        List<String> highestAddresses = locationRepository.findLocation(inputs.get(0), highestLevels);
        Set<String> searchedLocation = new HashSet<>();
        for (String highestAddressId : highestAddresses) {
            searchedLocation.add(highestAddressId);
            if (inputs.size() == 1) {
                continue;
            }
            List<String> childAddressIds = locationRepository.findChild(highestAddressId);
            for (int i = 1; i < inputs.size(); i++) {
                String currentInput = inputs.get(i);
                int levelLocation = highestAddressId.toCharArray().length / 2;
                List<Integer> levelsChild = List.of(1, 2, 3).subList(levelLocation, 3);
                List<String> similarAddresses = locationRepository.findLocation(currentInput, levelsChild, childAddressIds);
                searchedLocation.addAll(similarAddresses);
            }
        }
        return getLocationsWithPath(searchedLocation);
    }

    @Override
    public List<String> getLocationsChildIds(String parentId) {
        return locationRepository.findChild(parentId);
    }

    public List<LocationWithPathResponse> getLocationsWithPath(Collection<String> ids) {
        return locationRepository.findPaths(ids).stream()
                .map(tuple -> LocationWithPathResponse
                        .builder().id((String) tuple.get(0))
                        .path((String) tuple.get(1))
                        .build()
                ).collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public LocationWithPathResponse getLocationWithPathById(String id) {
        return Optional.ofNullable(getLocationsWithPath(List.of(id)).get(0)).orElseThrow(
                () -> new NotFoundException("Location not found")
        );
    }

    @Override
    public List<Location> findPath(String id) {
        return locationRepository.findPath(id);
    }
}
