package com.mock.qlgiaohangback.helpers;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.lang.reflect.Field;

public class ObjectHelpers {
    public static void copyNonNullProperties(Object target, Object in) {
        if (in == null || target == null) return;

        final BeanWrapper src = new BeanWrapperImpl(in);
        final BeanWrapper trg = new BeanWrapperImpl(target);

        for (final Field property : target.getClass().getDeclaredFields()) {
            Object providedObject = src.getPropertyValue(property.getName());
            if (providedObject != null) {
                trg.setPropertyValue(
                        property.getName(),
                        providedObject);
            }
        }
//        return target;
    }
}
