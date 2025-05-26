export const mapExternalToLocal = {
  Product: product => {
    return {
      customerld: product.customerId,
      cross_sell_line: product.cross_sell_line,
      discounts: discounts,
      distributorsellingprice: product.distributorsellingprice,
      is_featured: product.is_featured,
      is_multiplication_minimum_order_quantity:
      product.is_multiplication_minimum_order_quantity,
      is_quarterly_sold: product.is_quarterly_sold,
      minimum_order_quantity: product.minimum_order_quantity,
      mrp: product.mrp,
      must_sell_line: product.must_sell_line,
      name: product.name,
      ordered_quantity: product.ordered_quantity,
      photo_url: product.photo_url,
      sap_code: product.sap_code,
      stock: product.stock,
      suggested_line: product.suggested_line,
      unit: product.unit,
    };
  },
  Customer: customer => {
    return {
      customerId: customer.customerId,
      billing_address: customer.billing_address,
      customer_type: customer.customer_type,
      is_monthly_visited: customer.is_monthly_visited,
      is_own_con_num_verified: customer.is_own_con_num_verified,
      is_visited: customer.is_visited,
      name: customer.name,
      owner_contact_number: customer.owner_contact_number,
      route_id: customer.route_id,
      sap_code: customer.sap_code,
    };
  },
  OrderSummary: orderSummary => {
    return {
      schemes: orderSummary.schemes,
      total_order_amount: orderSummary.total_order_amount,
      total_order_quantity: orderSummary.total_order_amount,
    };
  },
  Order: order => {
    return {
      orderID: order.orderID,
      customerID: order.customerID,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      orderAmount: order.orderAmount,
      orderItems: order.orderItems,
    };
  },
  CheckIn: checkIn => {
    return {
      createdAt: checkIn.createdAt,
      customerID: checkIn.customerID,
      latitude: checkIn.latitude,
      longitude: checkIn.longitude,
    };
  },
  CheckOut: checkOut => {
    return {
      createdAt: checkOut.createdAt,
      customerID: checkOut.customerID,
      latitude: checkOut.latitude,
      longitude: checkOut.longitude,
      feedback: checkOut.feedback,
    };
  },
};

export const mapExternalToNetwork = {
  Product: product => {
    return {
      customerld: product.customerId,
      cross_sell_line: product.cross_sell_line,
      discounts: discounts,
      distributorsellingprice: product.distributorsellingprice,
      is_featured: product.is_featured,
      is_multiplication_minimum_order_quantity:
        product.is_multiplication_minimum_order_quantity,
      is_quarterly_sold: product.is_quarterly_sold,
      minimum_order_quantity: product.minimum_order_quantity,
      mrp: product.mrp,
      must_sell_line: product.must_sell_line,
      name: product.name,
      ordered_quantity: product.ordered_quantity,
      photo_url: product.photo_url,
      sap_code: product.sap_code,
      stock: product.stock,
      suggested_line: product.suggested_line,
      unit: product.unit,
    };
  },
  Customer: customer => {
    return {
      customerId: customer.customerId,
      billing_address: customer.billing_address,
      customer_type: customer.customer_type,
      is_monthly_visited: customer.is_monthly_visited,
      is_own_con_num_verified: customer.is_own_con_num_verified,
      is_visited: customer.is_visited,
      name: customer.name,
      owner_contact_number: customer.owner_contact_number,
      route_id: customer.route_id,
      sap_code: customer.sap_code,
    };
  },
  OrderSummary: orderSummary => {
    return {
      schemes: orderSummary.schemes,
      total_order_amount: orderSummary.total_order_amount,
      total_order_quantity: orderSummary.total_order_amount,
    };
  },
  Order: order => {
    return {
      orderID: order.orderID,
      customerID: order.customerID,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      orderAmount: order.orderAmount,
      orderItems: order.orderItems,
    };
  },
  CheckIn: checkIn => {
    return {
      createdAt: checkIn.createdAt,
      customerID: checkIn.customerID,
      latitude: checkIn.latitude,
      longitude: checkIn.longitude,
    };
  },
  CheckOut: checkOut => {
    return {
      createdAt: checkOut.createdAt,
      customerID: checkOut.customerID,
      latitude: checkOut.latitude,
      longitude: checkOut.longitude,
      feedback: checkOut.feedback,
    };
  },
};
