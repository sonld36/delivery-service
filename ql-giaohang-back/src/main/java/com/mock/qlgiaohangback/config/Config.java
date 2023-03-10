package com.mock.qlgiaohangback.config;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.entity.RoleEntity;
import com.mock.qlgiaohangback.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class Config implements WebMvcConfigurer {

    private final RoleRepository roleRepository;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*");
    }

    @Bean
    @Transactional(rollbackOn = SQLException.class)
    public void autoCreateRoleToDB() {
        List<String> roles = Arrays.asList(Constans.Roles.values())
                .stream()
                .map((item) -> item.name())
                .collect(Collectors.toList());


        List<String> rolePersisted = this.roleRepository.findDistinctByName();
        List<String> roleNotPersisted = roles.stream().filter((item) -> !rolePersisted.contains(item))
                .collect(Collectors.toList());
        System.out.print("ROLE -> ");
        if (roleNotPersisted.isEmpty()) {
            System.out.println("nothing to update");
        } else {
            this.roleRepository.saveAll(roleNotPersisted.stream().map(RoleEntity::new).collect(Collectors.toList()));
            System.out.println("update to success for: ");
            roleNotPersisted.forEach(System.out::println);
        }
        System.out.println("=====================");
    }
}
