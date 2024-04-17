package com.fsa.car_rental.service.impl;

import com.fsa.car_rental.config.aws.S3Properties;
import com.fsa.car_rental.service.S3Service;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3ServiceImpl implements S3Service {
    private final S3Client s3Client;
    private final String bucketName;

    public S3ServiceImpl(S3Client s3Client, S3Properties s3Properties) {
        this.s3Client = s3Client;
        this.bucketName = s3Properties.getBucketName();
    }

    @Override
    public void putFile(String fileName, String type, byte[] fileBytes) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .contentType(type)
                .key(fileName)
                .build();
        s3Client.putObject(objectRequest, RequestBody.fromBytes(fileBytes));
    }

    @Override
    public String getFileUrl(String filePath) {
        GetUrlRequest request = GetUrlRequest.builder().bucket(bucketName).key(filePath).build();
        return s3Client.utilities().getUrl(request).toExternalForm();
    }

    @Override
    public boolean deleteFile(String filePath) {
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(filePath)
                .build();
        return s3Client.deleteObject(objectRequest).deleteMarker();
    }
}
