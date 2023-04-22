package com.mock.qlgiaohangback.helpers;

import com.mock.qlgiaohangback.common.Constans;
import org.apache.commons.lang3.StringUtils;

public class StringHelper {

    public static String getSocketTopic(Constans.SocketTopic topic) {
        return "/" + StringUtils.lowerCase(topic.name());
    }
}
