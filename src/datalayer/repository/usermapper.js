// Convert between app model and Realm model
export const mapExternalToLocal= (user) => ({
  id: user.id,
  user: user.user,
  completed: user.completed,
});

// Convert Realm model to app model
export const mapLocalToExternal = (localUser) => ({
  id: localUser.id,
  user: localUser.user,
  completed: localUser.completed
});

// Convert app model to network model
export const mapExternalToNetwork= (user) => ({
  id: user.id,
  user: user.user,
  completed: user.completed,
});

// Convert network model to app model
export const mapNetworkToExternal = (networkUser) => ({
  id: networkUser.id,
  user: networkUser.user,
  completed: networkUser.completed,
});