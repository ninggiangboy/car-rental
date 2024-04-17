package com.fsa.car_rental.config;

import com.fsa.car_rental.exception.handler.CustomAccessDeniedHandler;
import com.fsa.car_rental.exception.handler.CustomAuthEntryPoint;
import com.fsa.car_rental.filter.CORSFilter;
import com.fsa.car_rental.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder encoder;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthEntryPoint customAuthEntryPoint;
    private final JwtAuthFilter jwtAuthFilter;
    private final CORSFilter corsFilter;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(encoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/login")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/refresh")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/users/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/register")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/register/verify")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/locations/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/cars/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/car-owners/cars/**")).hasAuthority("CAROWNER")
                .requestMatchers(new AntPathRequestMatcher("/api/v1/car-owners/info/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/wallets/confirm")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/v1/fake")).permitAll()
                .anyRequest().authenticated()
        );
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(corsFilter, org.springframework.web.filter.CorsFilter.class);
        http.exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(customAuthEntryPoint)
                .accessDeniedHandler(customAccessDeniedHandler)
        );
        return http.build();
    }
}
