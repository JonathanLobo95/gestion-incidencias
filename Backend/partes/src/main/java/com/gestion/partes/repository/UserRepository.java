package com.gestion.partes.repository;

import com.gestion.partes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //crucialpara la autenticación
    Optional<User> findByEmail(String email);

    // Útil para la validaciones en el registro
    Boolean existsByEmail(String email);

}
