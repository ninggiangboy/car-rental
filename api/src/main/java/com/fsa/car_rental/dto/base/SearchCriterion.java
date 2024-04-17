package com.fsa.car_rental.dto.base;

import jakarta.persistence.criteria.JoinType;
import lombok.Builder;

@Builder
public record SearchCriterion(
        String key,
        Object value,
        Operation operation,
        String joinTable,
        JoinType joinType
) {
    public enum Operation {
        GREATER_THAN,
        LESS_THAN,
        GREATER_THAN_EQUAL,
        LESS_THAN_EQUAL,
        NOT_EQUAL,
        EQUAL,
        LIKE,
        LIKE_START,
        LIKE_END,
        NULL,
        NOT_NULL,
        IN,
        BETWEEN
    }

    @Override
    public String toString() {
        return "SearchCriterion{" +
                "key='" + key + '\'' +
                ", value=" + value +
                ", operation=" + operation +
                ", joinTable='" + joinTable + '\'' +
                ", joinType=" + joinType +
                '}';
    }
}
