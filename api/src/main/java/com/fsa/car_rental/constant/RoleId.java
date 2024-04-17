package com.fsa.car_rental.constant;

import com.fsa.car_rental.entity.Role;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;

@RequiredArgsConstructor
@Getter
@Accessors(fluent = true)
public enum RoleId {
    CAR_OWNER(Role.builder().id(2).build()), CUSTOMER(Role.builder().id(1).build());

    private final Role role;
}
