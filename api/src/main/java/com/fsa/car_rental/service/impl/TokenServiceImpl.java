package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.config.TokenProperties;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.service.TokenService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class TokenServiceImpl implements TokenService {
    private static final String KEY_PATTERN = "%s::%s::%s";
    private static final String VALUE_PATTERN = "%s::%s";
    private final long refreshExpiration;
    private final long verifiedExpiration;
    private final RedisTemplate<String, String> redisTemplate;

    public TokenServiceImpl(TokenProperties tokenProperties, RedisTemplate<String, String> redisTemplate) {
        this.refreshExpiration = tokenProperties.getRefreshExpiration();
        this.verifiedExpiration = tokenProperties.getVerifiedExpiration();
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String generateRefreshToken(User user) {
        return saveUserToken(user, TokenType.REFRESH, refreshExpiration);
    }

    @Override
    public String generateVerifyToken(User user) {
        return saveUserToken(user, TokenType.VERIFIED, verifiedExpiration);
    }

    /**
     * Saves a token for the specified user in Redis.
     *
     * @param user       The user for whom to save the token.
     * @param tokenType  The type of token to save (REFRESH or VERIFIED).
     * @param expiration The expiration time of the token in milliseconds.
     * @return The generated token.
     */
    private String saveUserToken(User user, TokenType tokenType, long expiration) {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(
                String.format(KEY_PATTERN, tokenType.name(), user.getId().toString(), token),
                "",//them thong tin remember me
                expiration, TimeUnit.MILLISECONDS
        );
        return token;
    }

    @Override
    public void revokeAllUserTokens(User user, TokenType tokenType) {
        String keyPattern = String.format(KEY_PATTERN, tokenType.name(), user.getId().toString(), "*");
        Set<String> refreshTokens = redisTemplate.keys(keyPattern);
        if (refreshTokens != null && !refreshTokens.isEmpty()) {
            refreshTokens.forEach(redisTemplate::delete);
        }
    }

    @Override
    public void revokeRefreshToken(String refreshToken, User user) {
        UUID userId = getTokenInfo(refreshToken, TokenType.REFRESH);
        if (!userId.equals(user.getId())) {
            throw new ClientErrorException("Invalid refresh token");
        }
        redisTemplate.delete(String.format(KEY_PATTERN, TokenType.REFRESH.name(), userId, refreshToken));
    }

    @Override
    public UUID getTokenInfo(String token, TokenType tokenType) {
        String keyPattern = String.format(KEY_PATTERN, tokenType.name(), "*", token);
        Set<String> keys = redisTemplate.keys(keyPattern);
        if (keys == null || keys.isEmpty()) {
            throw new ClientErrorException("Invalid or expired token");
        }
        String key = keys.iterator().next();
        return UUID.fromString(key.split("::")[1]);
    }
}
