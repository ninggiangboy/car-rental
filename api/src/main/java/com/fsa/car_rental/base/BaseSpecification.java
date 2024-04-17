package com.fsa.car_rental.base;

import com.fsa.car_rental.dto.base.SearchCriterion;
import jakarta.persistence.criteria.*;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class BaseSpecification<T> implements Specification<T> {

    private final transient List<SearchCriterion> andSearchCriteria;
    private final transient List<SearchCriterion> orSearchCriteria;

    public BaseSpecification() {
        andSearchCriteria = new ArrayList<>();
        orSearchCriteria = new ArrayList<>();
    }

    public void where(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            boolean condition
    ) {
        and(operation, key, value, null, condition);
    }

    public void where(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            String joinTable,
            boolean condition
    ) {
        and(operation, key, value, joinTable, condition);
    }

    public void and(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            boolean condition
    ) {
        if (!condition) return;
        and(operation, key, value, null);
    }

    public void and(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            String joinTable,
            boolean condition
    ) {
        if (!condition) return;
        and(operation, key, value, joinTable);
    }

    private void and(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            String joinTable
    ) {
        SearchCriterion criterion = SearchCriterion.builder()
                .key(key)
                .value(value)
                .operation(operation)
                .joinTable(joinTable)
                .joinType(JoinType.LEFT)
                .build();
        andSearchCriteria.add(criterion);
    }

    public void or(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            boolean condition
    ) {
        if (!condition) return;
        or(operation, key, value, null);
    }

    public void or(
            SearchCriterion.Operation operation,
            String key,
            Object value,
            String joinTable,
            boolean condition
    ) {
        if (!condition) return;
        or(operation, key, value, joinTable);
    }

    private void or(SearchCriterion.Operation operation, String key, Object value, String joinTable) {
        SearchCriterion criterion = SearchCriterion.builder()
                .key(key)
                .value(value)
                .operation(operation)
                .joinTable(joinTable)
                .joinType(JoinType.LEFT)
                .build();
        orSearchCriteria.add(criterion);
    }

    @Override
    public Predicate toPredicate(
            @NonNull Root<T> root,
            @NonNull CriteriaQuery<?> query,
            @NonNull CriteriaBuilder builder) {
        List<Predicate> andPredicates = getPredicates(andSearchCriteria, root, builder);
        Predicate andPredicate = builder.and(andPredicates.toArray(new Predicate[0]));
        List<Predicate> orPredicates = getPredicates(orSearchCriteria, root, builder);
        Predicate orPredicate = builder.or(orPredicates.toArray(new Predicate[0]));
        return builder.or(andPredicate, orPredicate);
    }

    private List<Predicate> getPredicates(
            List<SearchCriterion> searchCriteria,
            Root<T> root,
            CriteriaBuilder builder
    ) {
        List<Predicate> predicates = new ArrayList<>();

        for (SearchCriterion criterion : searchCriteria) {
            String joinTable = criterion.joinTable();
            String key = criterion.key();
            Object value = criterion.value();

            Expression<?> path = (joinTable != null)
                    ? root.join(joinTable, criterion.joinType()).get(key)
                    : root.get(key);

            addPredicate(predicates, path, value, builder, criterion);
        }

        return predicates;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void addPredicate(
            List<Predicate> predicates,
            Expression<?> path,
            Object value,
            CriteriaBuilder builder,
            SearchCriterion criterion
    ) {
        Class<?> type = value.getClass();
        switch (criterion.operation()) {
            case NOT_EQUAL -> predicates.add(builder.notEqual(path, value));
            case EQUAL -> predicates.add(builder.equal(path, value));
            case NULL -> predicates.add(builder.isNull(path));
            case NOT_NULL -> predicates.add(builder.isNotNull(path));
            case GREATER_THAN -> predicates.add(builder.greaterThan(
                    path.as((Class<? extends Comparable>) type),
                    (Comparable) value
            ));
            case GREATER_THAN_EQUAL -> predicates.add(builder.greaterThanOrEqualTo(
                    path.as((Class<? extends Comparable>) type),
                    (Comparable) value
            ));
            case LESS_THAN -> predicates.add(builder.lessThan(
                    path.as((Class<? extends Comparable>) type),
                    (Comparable) value
            ));
            case LESS_THAN_EQUAL -> predicates.add(builder.lessThanOrEqualTo(
                    path.as((Class<? extends Comparable>) type),
                    (Comparable) value
            ));
            case LIKE -> predicates.add(builder.like(
                    builder.upper(path.as(String.class)),
                    "%" + value.toString().toUpperCase() + "%"
            ));
            case LIKE_START -> predicates.add(builder.like(
                    builder.upper(path.as(String.class)),
                    value.toString().toUpperCase() + "%",
                    builder.literal('\\')
            ));
            case LIKE_END -> predicates.add(builder.like(
                    builder.upper(path.as(String.class)),
                    "%" + value.toString().toUpperCase()
            ));
            case IN -> {
                if (value instanceof List<?> values) {
                    predicates.add(path.in(values));
                }
            }
            case BETWEEN -> {
                if (value instanceof List<?> range && range.size() == 2) {
                    predicates.add(builder.between(
                            path.as((Class<? extends Comparable>) range.get(0).getClass()),
                            (Comparable) range.get(0),
                            (Comparable) range.get(1)
                    ));
                }
            }
        }
    }

    public String toString() {
        return "spec(and=" + this.andSearchCriteria + ", or=" + this.orSearchCriteria + ")";
    }
}
