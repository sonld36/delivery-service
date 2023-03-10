package com.mock.qlgiaohangback.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JwtTokenUtil {
    private final String secret = "HelloJwt";
    private final long expiredTime = 5 * 1000 * 3600;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredTime))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Date getExpirationDateFromToken(String jwtToken) {
        return getClaimFromToken(jwtToken, Claims::getExpiration);
    }

    public boolean isTokenExpired(String jwtToken) {
        Date dateExpired = this.getExpirationDateFromToken(jwtToken);
        return dateExpired.before(new Date());
    }

    public boolean validateToken(String jwtToken, UserDetails userDetails) {
        String usernameFromToken = this.getUsernameFromToken(jwtToken);
        return usernameFromToken.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken);
    }

    public String getUsernameFromToken(String jwtToken) {
        return getClaimFromToken(jwtToken, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }


}
