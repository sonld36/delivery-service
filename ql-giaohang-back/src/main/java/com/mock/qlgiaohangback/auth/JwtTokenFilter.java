package com.mock.qlgiaohangback.auth;


import com.mock.qlgiaohangback.service.impl.AccountService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtTokenFilter extends HttpFilter {

    private final JwtTokenUtil jwtTokenUtil;

    private final AccountService userDetailsService;

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String requestTokenHeader = request.getHeader("Authorization");
//        System.out.println("token: " + requestTokenHeader);
        String username = null;
        String jwtToken = null;
//        request.getHeaderNames().asIterator().forEachRemaining(System.out::println);
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);

            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get Jwt token");
//                throw new ResponseException(MessageResponse.NOT_FOUND_TOKEN_IN_HEADER, HttpStatus.FORBIDDEN);
            } catch (ExpiredJwtException e) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write(e.getMessage());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                return;
            }
        }
//
//        System.out.println("username: " + username);
//        System.out.println("SecurityContextHolder.getContext().getAuthentication(): " + SecurityContextHolder.getContext().getAuthentication());

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//            System.out.println("userDetails: " + userDetails);
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                        = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
//        response.setHeader("Access-Control-Allow-Headers", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH");
        filterChain.doFilter(request, response);
    }
}
