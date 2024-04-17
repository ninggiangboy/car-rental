package com.fsa.car_rental.service;

import com.fsa.car_rental.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public interface JwtService {

    /**
     * Extracts the user's ID from a valid JWT token.
     *
     * @param token The JWT token to extract the user ID from.
     * @return The user's ID extracted from the token as a UUID.
     */
    UUID extractUserId(String token);

    /**
     * Extracts the user's authorities (roles) from a valid JWT token.
     *
     * @param token The JWT token to extract authorities from.
     * @return A collection of SimpleGrantedAuthority objects representing the user's roles.
     */
    Collection<SimpleGrantedAuthority> extractAuthorities(String token);

    /**
     * Generates a JWT token for a given user.
     *
     * @param user The user for whom to generate the token.
     * @return The generated JWT token as a string.
     */
    String generateToken(User user);

    /**
     * Checks if a JWT token is valid (not expired).
     *
     * @param token The token to validate.
     * @return True if the token is valid, False otherwise.
     */
    boolean isTokenValid(String token);
}
