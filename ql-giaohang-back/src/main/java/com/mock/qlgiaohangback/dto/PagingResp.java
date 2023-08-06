package com.mock.qlgiaohangback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagingResp<T> implements Serializable {
    private List<T> listData;
    private long totalPage;
}
