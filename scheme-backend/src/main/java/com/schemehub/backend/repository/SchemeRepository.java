package com.schemehub.backend.repository;

import com.schemehub.backend.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long>, JpaSpecificationExecutor<Scheme> {
    
    List<Scheme> findByStateNameIsNull();
    List<Scheme> findByStateName(String stateName);

    @Query("SELECT s.category, COUNT(s) FROM Scheme s GROUP BY s.category")
    List<Object[]> countSchemesByCategory();

    @Query("SELECT COALESCE(s.stateName, 'Central'), COUNT(s) FROM Scheme s GROUP BY s.stateName")
    List<Object[]> countSchemesByState();

    @Query("SELECT s FROM Scheme s ORDER BY s.viewsCount DESC")
    List<Scheme> findTop5ByOrderByViewsCountDesc();
}
