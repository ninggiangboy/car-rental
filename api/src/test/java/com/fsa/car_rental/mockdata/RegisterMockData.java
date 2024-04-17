package com.fsa.car_rental.mockdata;

import java.util.List;
import java.util.ArrayList;

import com.fsa.car_rental.dto.register.RegisterRequest;

public class RegisterMockData {
    public static List<RegisterRequest> registerMockList() {
        List<RegisterRequest> mockData = new ArrayList<RegisterRequest>();
        RegisterRequest nullEmailUser = RegisterRequest.builder()
                .fullName("Jane Smith")
                .phoneNumber("9876543210")
                .password("securepass")
                .roleId(2)
                .isEmailVerified(false)
                .build();

        RegisterRequest invalidEmailUser = RegisterRequest.builder()
                .email("invalidemail")
                .fullName("Alice Wonderland")
                .phoneNumber("555-1234")
                .password("p@ssw0rd")
                .roleId(3)
                .isEmailVerified(false)
                .build();

        RegisterRequest blankEmailUser = RegisterRequest.builder()
                .email("          ")
                .fullName("Bob Builder")
                .phoneNumber("9876543210")
                .password("bobbypass")
                .roleId(1)
                .isEmailVerified(false)
                .build();

        RegisterRequest longNameUser = RegisterRequest.builder()
                .email("user@example.com")
                .fullName(
                        "")
                .phoneNumber("9876543210")
                .password("longpass")
                .roleId(2)
                .isEmailVerified(false)
                .build();

        RegisterRequest longPhoneNumberUser = RegisterRequest.builder()
                .email("user2@example.com")
                .fullName("Michael Jordan")
                .phoneNumber("123456789012345678901")
                .password("mypass")
                .roleId(3)
                .isEmailVerified(false)
                .build();

        RegisterRequest shortPasswordUser = RegisterRequest.builder()
                .email("user3@example.com")
                .fullName("Emma Watson")
                .phoneNumber("555-4321")
                .password("pass")
                .roleId(1)
                .isEmailVerified(false)
                .build();

        RegisterRequest nullPasswordUser = RegisterRequest.builder()
                .email("user4@example.com")
                .fullName("Chris Evans")
                .phoneNumber("1234567890")
                .roleId(2)
                .isEmailVerified(false)
                .build();

        RegisterRequest verifiedUser = RegisterRequest.builder()
                .email("test@example.com")
                .fullName("John Doe")
                .phoneNumber("1234567890")
                .password("password123")
                .roleId(1)
                .isEmailVerified(true)
                .build();
        RegisterRequest unverfiedEmailUser = RegisterRequest.builder()
                .email("test@example.com")
                .fullName("Duplicate User")
                .phoneNumber("9999999999")
                .password("duplicatepass")
                .roleId(3)
                .isEmailVerified(false)
                .build();

        // mockData.add(invalidEmailUser);
        //  mockData.add(blankEmailUser);
        // mockData.add(longNameUser);
        // mockData.add(longPhoneNumberUser);
        // mockData.add(shortPasswordUser);
        // mockData.add(nullPasswordUser);

        mockData.add(verifiedUser);
        mockData.add(unverfiedEmailUser);

        return mockData;
    }

}