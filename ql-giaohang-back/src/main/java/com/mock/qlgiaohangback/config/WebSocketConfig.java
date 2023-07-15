package com.mock.qlgiaohangback.config;

import com.mock.qlgiaohangback.common.Constans;
import com.mock.qlgiaohangback.helpers.StringHelper;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker(StringHelper.getSocketTopic(Constans.SocketTopic.NOTIFY),
                StringHelper.getSocketTopic(Constans.SocketTopic.LOG),
                StringHelper.getSocketTopic(Constans.SocketTopic.STATUS_UPDATE),
                StringHelper.getSocketTopic(Constans.SocketTopic.LOCATION),
                StringHelper.getSocketTopic(Constans.SocketTopic.REQUEST_SHIPPING));
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/socket").setAllowedOriginPatterns("http://localhost:3000/", "*").withSockJS();
    }

}
