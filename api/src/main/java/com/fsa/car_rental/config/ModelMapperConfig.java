package com.fsa.car_rental.config;

import org.modelmapper.AbstractConverter;
import org.modelmapper.Conditions;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.record.RecordModule;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ModelMapperConfig {
    private final Converter<String, String> trimConverter = new AbstractConverter<>() {
        protected String convert(String source) {
            return source == null ? null : source.trim();
        }
    };

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(trimConverter);
        modelMapper.registerModule(new RecordModule());
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
        return modelMapper;
    }
}
