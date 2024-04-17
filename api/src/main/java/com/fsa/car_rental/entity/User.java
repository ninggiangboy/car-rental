package com.fsa.car_rental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;

/**
 * Entity class for Users
 */
@FieldNameConstants
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users", schema = "car_rental")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;

    @Column(name = "email")
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "image")
    private String image;

    @Column(name = "hashed_password")
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;

    @Column(name = "is_blocked")
    private Boolean isBlocked = false;

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "driver_license")
    private String driverLicense;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Wallet wallet;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Set.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public String getUsername() {
        return id.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isBlocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEmailVerified;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ")";
    }
}