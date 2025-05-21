package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entities.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.createToken(authentication);
            
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (AuthenticationException e) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.isEmailTaken(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        User user = userService.createUser(
                null,  // Customer object is set to null for now
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                "ROLE_USER" // Default role for registered users
        );

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.isEmailTaken(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        User user = userService.createUser(
                null,  // Customer object is set to null for now
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                "ROLE_ADMIN" // Admin role
        );

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
} 