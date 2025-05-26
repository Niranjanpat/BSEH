const API_URL = 'https://your.api/todos';

export const getUserFromServer = async () => { 
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const pushUserToServer = async networkTodo => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(networkTodo),
  });
};