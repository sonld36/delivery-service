import { OrderLogAction, orderStatus } from '@Common/const'
import { OrderLogType } from '@Common/types'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

type Props = {
  item: OrderLogType
}

function MessageLog(props: Props) {
  const { item } = props;
  switch (item.action) {
    case OrderLogAction.ORDER_LOG_ACTION_CREATED: {
      return (
        <Typography variant='caption'>{item.account.name} tạo đơn hàng mới <Link to={`quan-ly-don-hang/tat-ca?order=${item.order.id}`}>#{
          item.order.id
        }</Link></Typography>
      )
    }
    case OrderLogAction.ORDER_LOG_ACTION_UPDATED: {
      return (<Typography variant='caption'>{item.account.name} thay đổi trạng thái đơn hàng <Link to={`quan-ly-don-hang/tat-ca?order=${item.order.id}`}>#{
        item.order.id
      }</Link> thành <Typography fontWeight={"bold"} variant='inherit'>{orderStatus[item.toStatus]}</Typography></Typography>)
    }
    default:
      return (<Typography variant='caption'>{item.account.name} hủy đơn hàng <Link to={`quan-ly-don-hang/tat-ca?order=${item.order.id}`}>#{
        item.order.id
      }</Link></Typography>)

  }
}

export default MessageLog