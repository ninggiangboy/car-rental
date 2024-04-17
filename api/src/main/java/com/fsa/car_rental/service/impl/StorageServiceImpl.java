package com.fsa.car_rental.service.impl;


import com.fsa.car_rental.constant.storage.FileType;
import com.fsa.car_rental.exception.ClientErrorException;
import com.fsa.car_rental.exception.ServerErrorException;
import com.fsa.car_rental.service.S3Service;
import com.fsa.car_rental.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private final S3Service s3Service;

    @Override
    public String store(FileType type, MultipartFile file) {
        String fileExtension = checkInvalidFile(file, type);
        String unique = UUID.randomUUID().toString();
        String fileName = switch (type) {
            case IMAGE -> unique + '.' + fileExtension;
            case DOCUMENT -> unique + '/' + file.getOriginalFilename();
        };
        String filePath = String.join("/", type.getLocation(), fileName);
        try {
            byte[] bytes = file.getBytes();
            s3Service.putFile(filePath, type.getType(), bytes);
        } catch (IOException e) {
            throw new ServerErrorException("Can't load file");
        }
        return filePath;
    }

    @Override
    public String getUrl(String filePath) {
        return s3Service.getFileUrl(filePath);
    }

    @SneakyThrows
    private String checkInvalidFile(MultipartFile file, FileType type) {
        if (file == null || file.isEmpty()) {
            throw new ClientErrorException("Failed to storeFile empty file.");
        }
        String fileName = file.getName();
        if (fileName.isEmpty()) {
            throw new ClientErrorException("File has no valid name.");
        }

        String fileExtension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (!type.getAllowedExtensions().contains(fileExtension)) {
            throw new ClientErrorException(
                    String.format("File extension %s is not allowed, only accept %s", fileExtension, type.getAllowedExtensions())
            );
        }

        if (file.getSize() > type.getMaxSize()) {
            throw new ClientErrorException("File must be <= " + type.getMaxSize() / 1_000_000L + "Mb");
        }
        return fileExtension;
    }
}
