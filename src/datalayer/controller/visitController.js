import Realm from 'realm';
import {fetchRemoteProducts, fetchRemoteCustomers} from './networkAPI';
import {ProductSchema, CustomerSchema} from './schemas';

// 🔁 Efficient deep comparison for product
const updateProductIfChanged = (local, remote) => {
    local.name = remote.name;
    local.price = remote.price;
    local.category = remote.category;
  };

// 🔁 Efficient deep comparison for customer
const updateCustomerIfChanged = (local, remote) => {
    local.name = remote.name;
    local.email = remote.email;
};

export async function syncDataFromServer() {
  const [remoteProducts, remoteCustomers] = await Promise.all([
    fetchRemoteProducts(),
    fetchRemoteCustomers(),
  ]);

  const realm = await Realm.open({
    schema: [ProductSchema, CustomerSchema],
  });

  realm.write(() => {
    // ------------------ PRODUCT SYNC ------------------
    const localProducts = realm.objects('Product');
    const remoteProductMap = new Map();
    remoteProducts.forEach(p => remoteProductMap.set(p.productId, p));

    localProducts.forEach(local => {
      const id = local.productId;
      const remote = remoteProductMap.get(id) || null;

      if (!remote) {
        // New product
        realm.delete(local);
      } else {
        // Only update changed fields
        remoteProductMap.delete(id);
        updateProductIfChanged(local, remote);
      }

          // Delete local products not in remote
    for (const [ProductId, Product] of map) {
      realm.create('Product', Product);
      // 👉 Perform your action here
    }
    });



    // ------------------ CUSTOMER SYNC ------------------
    const localCustomers = realm.objects('Customer');
    const remoteCustomerMap = new Map();
    remoteCustomers.forEach(c => remoteCustomerMap.set(c.customerId, c));

    localCustomers.forEach(local => {
      const id = local.customerId;
      const remote = remoteCustomerMap.get(id) || null;

      if (!remote) {
        // New customer
        realm.delete(local);
      } else {
        // Update only changed fields
        updateCustomerIfChanged(local, remote);
      }

     for (const [customerId, customer] of map) {   
         realm.create('Customer',   customer);
         // 👉 Perform your action here
      } });

})
  realm.close();
}
