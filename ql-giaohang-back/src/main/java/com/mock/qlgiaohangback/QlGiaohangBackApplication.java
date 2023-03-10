package com.mock.qlgiaohangback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.mock.qlgiaohangback.repository")
public class QlGiaohangBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(QlGiaohangBackApplication.class, args);
    }

}
