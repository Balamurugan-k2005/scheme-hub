package com.schemehub.backend.repository;

import com.schemehub.backend.entity.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    List<UserReport> findByStatus(String status);
    long countByStatus(String status);
}
