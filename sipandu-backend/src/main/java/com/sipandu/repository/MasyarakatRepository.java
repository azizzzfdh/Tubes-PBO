package com.sipandu.repository;

import com.sipandu.model.Masyarakat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MasyarakatRepository extends JpaRepository<Masyarakat, Long> {
    Optional<Masyarakat> findByEmail(String email);
}
