package com.fsa.car_rental.service;

import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.entity.User;

import java.util.UUID;

public interface TokenService {

    /**
     * Generates a refresh token for the specified user.
     *
     * @param user The user for whom to generate the refresh token.
     * @return The generated refresh token.
     */
    String generateRefreshToken(User user);

    /**
     * Generates a verification token for the specified user.
     *
     * @param user The user for whom to generate the verification token.
     * @return The generated verification token.
     */
    String generateVerifyToken(User user);

    void revokeAllUserTokens(User user, TokenType tokenType);


    /**
     * Revokes a specific refresh token for the specified user.
     *
     * @param refreshToken The refresh token to revoke.
     * @param user         The user whose refresh token should be revoked.
     */
    void revokeRefreshToken(String refreshToken, User user);

    /**
     * Retrieves the user ID associated with a given token.
     *
     * @param token     The token to retrieve information about.
     * @param tokenType The type of token (REFRESH or VERIFIED).
     * @return The user ID associated with the token.
     */
    UUID getTokenInfo(String token, TokenType tokenType);
}
