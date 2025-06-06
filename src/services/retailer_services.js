import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';

// get all customers and also there is remaining to add the pagination 
// export const getRetailer = async () => {
//   return await client.get(URLS.customer);
// };
//get all customers with pagination
export const getRetailer = async (
  routeId,
  filterData,
  assignee,
  page,
  contactNumber,
  name,
) => {
  return await client.get(URLS.customer, {
    params: {
      route_id: routeId,
      ...filterData,
      assignee,
      page,
      name,
      owner_contact_number: contactNumber,
    },
  });
};

//get customer detail by id
export const getRetailerDetailById = async id => {
  return await client.get(`${URLS.customer}/${id}`);
}

export const getTodayRetailer= async () =>{
  return await client.get(URLS.customerToday);
}


//create customer api :-working 
export const addShop = async data => {
  return await clientMultipart.post(URLS.customer.replace('/', ''), data);
};

//update customer api :- working
export const editShop = async (data, id) => {
  console.log("form data",data,id);
  return await clientMultipart.post(URLS.customerToday + id, data);
};

export const getCustomerTarget = async id => {
  const url = `customers/${id}/current-targets`;
  return await client.get(url);
};

export const updateShopLocation = async (id, data) => {
  return await client.post(URLS.customer + id + '/update-location', data);
};
export const getCustomerTypeList = async () => {
  return await client.get(URLS.customerType);
};

export const getCustomerActivityList = async () => {
  return await client.get(URLS.customerActivityCategories);
};

export const getCustomerClassList = async () => {
  return await client.get(URLS.customerClass);
};

export const getBeatList = async isMyVisits => {
  const url = isMyVisits ? URLS.routesToday : URLS.route;
  return await client.get(url);
};

export const getBeatDetail = async id => {
  return await client.get(`${URLS.route}/${id}`);
}

export const getPinCodeList = async(value ,id)=> {
  console.log(value,id);
  return await client.get(`pin-codes/search?term=${value}&page=1&city_id=${id}`);
};

export const getState = async () => {
  return await client.get(`states`);
};

export const getCitiesList = async (value, pinCode) => {
  return await client.get(
    `cities/search?pin_code_id=${pinCode}&term=${value}&page=1`,
  );
};

export const getCitiesDetail = async value => {
  return await client.get(`cities/${value}`);
};
