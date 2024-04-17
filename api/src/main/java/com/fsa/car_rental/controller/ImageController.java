package com.fsa.car_rental.controller;

import com.fsa.car_rental.base.BaseController;
import com.fsa.car_rental.constant.storage.FileType;
import com.fsa.car_rental.dto.base.ResultResponse;
import com.fsa.car_rental.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${prefix.api}/images")
@RequiredArgsConstructor
public class ImageController extends BaseController {

    private final StorageService storageService;

    @PostMapping()
    public ResponseEntity<ResultResponse> uploadImage(@RequestParam MultipartFile file) {
        String fileName = storageService.store(FileType.IMAGE, file);
        String filePath = storageService.getUrl(fileName);
        return buildResponse("Upload successfully", filePath);
    }
}
