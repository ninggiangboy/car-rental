package com.fsa.car_rental.service;

import java.util.*;

import com.fsa.car_rental.dto.location.LocationResponse;
import com.fsa.car_rental.dto.location.LocationWithPathResponse;
import com.fsa.car_rental.entity.Location;

public interface LocationService {

    List<LocationWithPathResponse> search(String name);

    List<String> getLocationsChildIds(String parentId);

    List<LocationWithPathResponse> getLocationsWithPath(Collection<String> ids);

    LocationWithPathResponse getLocationWithPathById(String id);

    List<Location> findPath(String id);
}
