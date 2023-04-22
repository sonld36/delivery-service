package com.mock.qlgiaohangback.config;

import com.mock.qlgiaohangback.auth.JwtTokenFilter;
import com.mock.qlgiaohangback.common.Constans;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true
//        securedEnabled = true,
//        jsr250Enabled = true
)
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeHttpRequests()
                .antMatchers("/**").permitAll()
                .antMatchers("/auth/**").permitAll()

//                .antMatchers(HttpMethod.GET,"/product/**").permitAll()
//                .antMatchers("/product/**").hasAnyAuthority(Constans.Roles.ROLE_SHOP.name(), Constans.Roles.ROLE_USER.name())
//                .antMatchers("/account/**").permitAll()
//                .antMatchers("/customer/**").hasAnyAuthority(Constans.Roles.ROLE_SHOP.name())
//                .antMatchers("/shop/**").hasAnyAuthority(Constans.Roles.ROLE_SHOP.name(), Constans.Roles.ROLE_DELIVERY_MANAGER.name(), Constans.Roles.ROLE_USER.name())
//                .antMatchers("/order/**").permitAll()
                .anyRequest().authenticated()
                .and().exceptionHandling()
//                .authenticationEntryPoint(authenticationEntryPoint)
                .and().formLogin().disable();


//        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

