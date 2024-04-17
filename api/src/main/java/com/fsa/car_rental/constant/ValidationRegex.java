package com.fsa.car_rental.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.NONE)
public final class ValidationRegex {
    public static final String PgASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*.#?&_]{8,}$";
    public static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
}
