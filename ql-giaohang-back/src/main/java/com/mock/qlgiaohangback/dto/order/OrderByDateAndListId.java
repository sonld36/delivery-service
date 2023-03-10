package com.mock.qlgiaohangback.dto.order;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
public class OrderByDateAndListId {
    private Long carrierId;
    private Date createdAt;
    private List<Long> listId;
}
