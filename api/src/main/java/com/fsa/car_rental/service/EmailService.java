package com.fsa.car_rental.service;

import org.springframework.core.io.InputStreamSource;

import java.util.Map;

public interface EmailService {

    void send(String subject, String emailTo, String content);

    void send(String subject, String emailTo, String template, Map<String, Object> variables);

    void send(String subject, String emailTo, String content, String attachmentName, InputStreamSource attachment);

    void send(String subject, String emailTo, String template, Map<String, Object> variables, String attachmentName, InputStreamSource attachment);
}