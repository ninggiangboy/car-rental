package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.dto.location.LocationWithPathResponse;
import com.fsa.car_rental.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${prefix.api}/locations")
@RequiredArgsConstructor
public class LocationController extends BaseController {

    private final LocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<ResultResponse> search(@RequestParam("name") String name) {
        List<LocationWithPathResponse> locations = locationService.search(name);
        return buildResponse("Locations suggest", locations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> get(@PathVariable("id") String id) {
        LocationWithPathResponse location = locationService.getLocationWithPathById(id);
        return buildResponse("Location detail", location);
    }
}
