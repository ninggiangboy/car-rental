package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.dto.location.LocationWithPathResponse;
import com.fsa.car_rental.repository.LocationRepository;
import com.fsa.car_rental.service.LocationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LocationServiceImplTest {

    @Mock
    private LocationService locationService;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationServiceImpl addressServiceImpl;

    /**
     * This method tests the search method in the LocationService class, with the given data is "Ha"
     */
    @Test
    void search_AddressName1_ShouldReturnFullPathAddress() {
        String addressName = "Ha";
        List<LocationWithPathResponse> expected = Arrays.asList(
                LocationWithPathResponse.builder().id("16660").path("Xã Hải Hà, Thị xã Nghi Sơn, Tỉnh Thanh Hóa").build(),
                LocationWithPathResponse.builder().id("42").path("Tỉnh Hà Tĩnh").build(),
                LocationWithPathResponse.builder().id("14251").path("Xã Hải Hà, Huyện Hải Hậu, Tỉnh Nam Định").build(),
                LocationWithPathResponse.builder().id("15343").path("Xã Hà Hải, Huyện Hà Trung, Tỉnh Thanh Hóa").build());
        when(locationService.search(addressName)).thenReturn(expected);
        List<LocationWithPathResponse> actual = locationService.search(addressName);
        assertArrayEquals(expected.toArray(), actual.toArray());
    }

    /**
     * This method tests the search method in the LocationService class, with the given data is "Dương"
     */
    @Test
    void search_AddressName2_ShouldReturnFullPathAddress() {
        String addressName2 = "Dương";
        List<LocationWithPathResponse> expected = Arrays.asList(
                LocationWithPathResponse.builder().id("00571").path("Xã Dương Xá, Huyện Gia Lâm,Thành phố Hà Nội").build(),
                LocationWithPathResponse.builder().id("07408").path("Xã Dương Đức, Huyện Lạng Giang, Tỉnh Bắc Giang").build(),
                LocationWithPathResponse.builder().id("12811").path("Xã Đông Dương, Huyện Đông Hưng, Tỉnh Thái Bình").build(),
                LocationWithPathResponse.builder().id("07321").path("Xã An Dương, Huyện Tân Yên, Tỉnh Bắc Giang").build(),
                LocationWithPathResponse.builder().id("00541").path("Xã Dương Hà, Huyện Gia Lâm, Thành phố Hà Nội").build(),
                LocationWithPathResponse.builder().id("25398").path("Xã Đường 10, Huyện Bù Đăng, Tỉnh Bình Phước").build(),
                LocationWithPathResponse.builder().id("31096").path("Xã Dương Tơ, Thành phố Phú Quốc, Tỉnh Kiên Giang").build(),
                LocationWithPathResponse.builder().id("31078").path("Phường Dương Đông, Thành phố Phú Quốc, Tỉnh Kiên Giang").build(),
                LocationWithPathResponse.builder().id("12154").path("Xã Đào Dương, Huyện Ân Thi, Tỉnh Hưng Yên").build(),
                LocationWithPathResponse.builder().id("10180").path("Xã Hồng Dương,Huyện Thanh Oai, Thành phố Hà Nội").build()
        );
        when(locationService.search(addressName2)).thenReturn(expected);
        List<LocationWithPathResponse> actual = locationService.search(addressName2);
        assertArrayEquals(expected.toArray(), actual.toArray());
    }
}
