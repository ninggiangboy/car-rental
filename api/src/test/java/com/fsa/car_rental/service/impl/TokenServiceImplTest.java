package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.config.TokenProperties;
import com.fsa.car_rental.dto.base.TokenType;
import com.fsa.car_rental.entity.User;
import com.fsa.car_rental.mockdata.UserMockData;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class TokenServiceImplTest {

    private static final String KEY_PATTERN = "%s::%s::%s";
    private static final String VALUE_PATTERN = "%s::%s";
    @Mock
    private TokenProperties tokenProperties;
    @Mock
    private RedisTemplate<String, String> redisTemplate;
    @Mock
    TokenType tokenType;

    @InjectMocks
    private TokenServiceImpl tokenService;

    //add then check redis exists
    @Test
    void generateRefreshToken() {

    }

    @Test
    void generateVerifyToken() {
    }

//    @Test
//    void tokenService_RevokeRefreshToken_ValidUserAndToken() {
//        User user = UserMockData.user;
//        String refreshToken = "refreshToken";
////        Mockito.mock(tokenService.getTokenInfo(refreshToken, tokenType));
//        Mockito.when(tokenService.
//                        getTokenInfo(Mockito.any(String.class), Mockito.any(TokenType.class)))
//                .thenReturn(user.getId());
//        tokenService.revokeRefreshToken(refreshToken, user);
//        Mockito.verify(redisTemplate).delete(String.format(KEY_PATTERN, TokenType.REFRESH.name(), user.getId(), refreshToken));
//    }

    @Test
    void tokenService_GetTokenInfo_ReturnUUID() {
        User user = UserMockData.user;
        String token = "token";
        String keyPattern = String.format(KEY_PATTERN, tokenType.name(), user.getId(), token);
        Set<String> keys = new HashSet<String>();
        keys.add(keyPattern);

        Mockito.when(redisTemplate.keys(Mockito.any(String.class))).thenReturn(keys);
        UUID uuid = tokenService.getTokenInfo(token, tokenType);
        Assertions.assertEquals(uuid, user.getId());
    }
}