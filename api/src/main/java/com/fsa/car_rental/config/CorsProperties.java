package com.fsa.car_rental.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

@ConfigurationProperties(prefix = "cors")
public record CorsProperties(
        Map<String, String> headers
) {
}
