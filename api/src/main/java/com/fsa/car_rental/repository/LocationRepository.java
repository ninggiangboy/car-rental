package com.fsa.car_rental.repository;

import com.fsa.car_rental.entity.Location;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, String> {

    @Query(value = """
            SELECT location.location_id,
            STRING_AGG(parent.location_name, ', ' ORDER BY parent.left_index DESC) AS path_name
            FROM car_rental.locations location
            JOIN car_rental.locations parent ON location.left_index BETWEEN parent.left_index AND parent.right_index
            WHERE location.location_id IN (:ids)
            GROUP BY location.location_id
            """, nativeQuery = true)
    List<Tuple> findPaths(Collection<String> ids);

    @Query(value = """
                SELECT parent.* FROM  car_rental.locations location, car_rental.locations parent
                WHERE location.left_index BETWEEN parent.left_index AND parent.right_index
                AND location.location_id = :id ORDER BY parent.location_level DESC
            """, nativeQuery = true)
    List<Location> findPath(String id);

    @Query(value = """
                SELECT child.location_id FROM car_rental.locations location, car_rental.locations child
                WHERE (child.left_index BETWEEN location.left_index AND location.right_index)
                AND (child.right_index BETWEEN location.left_index AND location.right_index)
                AND child.location_id != :id
                AND location.location_id = :id ORDER BY child.left_index
            """, nativeQuery = true)
    List<String> findChild(String id);

    @Query(value = """
                    WITH similarity_calc AS (
                        SELECT location_id,
                        location_level,
                        SIMILARITY(slug, slugify(:name)) AS similarity_score
                        FROM car_rental.locations
                    )
                    SELECT location_id
                    FROM similarity_calc
                    WHERE similarity_score > 0.35
                    AND location_level IN (:levels)
                    ORDER BY location_level, similarity_score DESC LIMIT 10
            """, nativeQuery = true)
    List<String> findLocation(String name, List<Integer> levels);

    @Query(value = """
                    WITH similarity_calc AS (
                        SELECT location_id,
                        location_level,
                        SIMILARITY(slug, slugify(:name)) AS similarity_score
                        FROM car_rental.locations
                    )
                    SELECT location_id
                    FROM similarity_calc
                    WHERE similarity_score > 0.35
                    AND location_level IN (:levels)
                    AND location_id IN (:ids)
                    ORDER BY location_level, similarity_score DESC LIMIT 10
            """, nativeQuery = true)
    List<String> findLocation(String name, List<Integer> levels, List<String> ids);
}
