package com.fsa.car_rental.service;


import com.fsa.car_rental.constant.storage.FileType;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(FileType type, MultipartFile file);

    String getUrl(String filePath);
}
