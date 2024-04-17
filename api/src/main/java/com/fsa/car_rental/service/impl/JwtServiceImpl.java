package com.fsa.car_rental.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fsa.car_rental.config.TokenProperties;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.SneakyThrows;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtServiceImpl implements JwtService {
    private final String secretKey;
    private final long accessExpiration;
    private final ObjectMapper objectMapper;

    public JwtServiceImpl(TokenProperties tokenProperties, ObjectMapper objectMapper) {
        this.secretKey = tokenProperties.getSecretKey();
        this.accessExpiration = tokenProperties.getAccessExpiration();
        this.objectMapper = objectMapper;
    }


    @Override
    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaim(token, Claims::getSubject));
    }

    @SneakyThrows
    @Override
    public Collection<SimpleGrantedAuthority> extractAuthorities(String token) {
        String roleString = extractClaim(token, claims -> claims.get("role", String.class));
        List<String> roles = Arrays.asList(objectMapper.readValue(roleString, String[].class));
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override
    public String generateToken(User user) {
        return generateToken(getExtraClaims(user), user);
    }

    @Override
    public boolean isTokenValid(String token) {
        return extractClaim(token, Claims::getExpiration).after(new Date());
    }

    /**
     * Internal method for generating a JWT token.
     *
     * @param extraClaims Additional claims to include in the token.
     * @param user        The user for whom the token is generated.
     * @return The generated JWT token as a string.
     */
    private String generateToken(Map<String, Object> extraClaims, User user) {
        return buildToken(extraClaims, user, accessExpiration);
    }

    /**
     * Internal method for building the JWT token structure.
     *
     * @param extraClaims Additional claims to include in the token.
     * @param user        The user for whom the token is generated.
     * @param expiration  The expiration time of the token in milliseconds.
     * @return The built JWT token as a string.
     */
    private String buildToken(Map<String, Object> extraClaims, User user, long expiration) {
        long currentTime = System.currentTimeMillis();
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(currentTime + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Internal method for extracting a specific claim from a JWT token.
     *
     * @param token          The JWT token to extract the claim from.
     * @param claimsResolver A function that takes Claims object and returns the desired claim.
     * @return The extracted claim value.
     * @throws InvalidBearerTokenException If the token is invalid or cannot be parsed.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Internal method for extracting all claims from a JWT token.
     *
     * @param token The JWT token to extract all claims from.
     * @return The extracted claims object.
     * @throws InvalidBearerTokenException If the token is invalid or cannot be parsed.
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new InvalidBearerTokenException("Invalid JWT token: " + e.getMessage());
        }
    }

    /**
     * Internal method for retrieving additional claims for a user to be included in the token.
     *
     * @param user The user for whom to retrieve extra claims.
     * @return A map containing the extra claims.
     */
    @SneakyThrows
    private Map<String, Object> getExtraClaims(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("email", user.getEmail());
        extraClaims.put("fullName", user.getFullName());
        extraClaims.put("picture", user.getImage());
        extraClaims.put("role", user.getRole().getName());
        return extraClaims;
    }

    /**
     * Internal method for retrieving the secret key used for signing JWT tokens.
     *
     * @return The signing key.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
