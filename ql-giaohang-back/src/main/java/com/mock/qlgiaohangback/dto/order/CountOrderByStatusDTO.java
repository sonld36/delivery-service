package com.mock.qlgiaohangback.dto.order;

import com.mock.qlgiaohangback.common.Constans;
import lombok.Data;
import lombok.NoArgsConstructor;

//@NamedNativeQuery(name = "countByStatus",
//        query = "SELECT status,COUNT(status) AS number FROM _orders group by status",
//        resultSetMapping = "countByStatus")
//@SqlResultSetMapping(name = "countByStatus",
//        classes = @ConstructorResult(targetClass = CountOrderByStatusDTO.class,
//                columns = {@ColumnResult(name = "status",type= Constans.OrderStatus.class),
//                        @ColumnResult(name = "number",type = Integer.class)}))

@NoArgsConstructor
@Data
public class CountOrderByStatusDTO {
    private Constans.OrderStatus status;
    private Integer number;
}
