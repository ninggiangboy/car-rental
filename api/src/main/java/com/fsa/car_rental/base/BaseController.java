package com.fsa.car_rental.base;

import com.fsa.car_rental.dto.base.PageInfo;
import com.fsa.car_rental.dto.base.ResultResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

public class BaseController {

    protected ResponseEntity<ResultResponse> buildResponse() {
        return buildResponse("Successful", null, HttpStatus.OK);
    }

    protected ResponseEntity<ResultResponse> buildResponse(String message) {
        return buildResponse(message, null, HttpStatus.OK);
    }

    protected ResponseEntity<ResultResponse> buildResponse(String message, Object result) {
        return buildResponse(message, result, HttpStatus.OK);
    }

    protected ResponseEntity<ResultResponse> buildResponse(String message, HttpStatus status) {
        return buildResponse(message, null, status);
    }

    protected ResponseEntity<ResultResponse> buildResponse(String message, Object result, HttpStatus status) {
        result = Optional.ofNullable(result)
                .map(r -> r instanceof Page<?> page ? getPageInfo(page) : Map.of("data", r))
                .orElse(Map.of());

        ResultResponse response = ResultResponse.builder()
                .result(result)
                .message(message)
                .status(status.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(status).body(response);
    }

    private Map<String, Object> getPageInfo(Page<?> page) {
        return Map.of(
                "data", page.getContent(),
                "pageMeta", PageInfo.builder()
                        .pageSize(page.getSize())
                        .page(page.getNumber() + 1)
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .hasNext(page.hasNext())
                        .hasPrev(page.hasPrevious())
                        .build());
    }
}
