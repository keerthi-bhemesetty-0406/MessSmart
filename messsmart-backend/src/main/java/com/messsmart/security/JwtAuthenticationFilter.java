package com.messsmart.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // We pass our component instance manually to the custom instantiation context
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");

        // 1. Look for a valid standard HTTP Bearer token scheme header prefix
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Extra verification validation to verify token expiration timeline boundaries
                if (jwtUtil.validateToken(token, username)) {
                    
                    // 2. Extract our customized 'role' claims payload value mapping back from your generateToken method
                    String role = jwtUtil.extractClaim(token, claims -> claims.get("role", String.class));
                    
                    // Fallback to default if no role header claim was embedded
                    if (role == null) {
                        role = "ROLE_STUDENT"; 
                    }
                    
                    // Spring Security matches hasRole mappings expecting the "ROLE_" string prefix convention
                    if (!role.startsWith("ROLE_")) {
                        role = "ROLE_" + role.toUpperCase();
                    }

                    // 3. Map parsed string role directly into Spring Security granted authority constraints
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, authorities
                    );

                    // 4. Authenticate the security context session pipeline completely
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Clear session indicators immediately if parsing fails due to signature validation issues
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}