import * as SecureStore from 'expo-secure-store';

// Log the user in, validating the credentials and setting session state
export async function loginUser(username: string, password: string) {
  // Get the stored password for this username
  const storedPassword = await SecureStore.getItemAsync(`${username}_password`);

  if (!storedPassword) {
    return false; // No account exists for this username
  }

  // Match entered password with stored password
  if (password === storedPassword) {
    // Set session and store current username
    await SecureStore.setItemAsync('session', 'active');
    await SecureStore.setItemAsync('username', username); // Needed for Settings screen
    return true;
  }

  return false; // Wrong password
}


// Save sensitive data like login credentials or other secure information
export const saveSecureData = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving data to SecureStore:", error);
  }
};

// Retrieve sensitive data from SecureStore
export const getSecureData = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving data from SecureStore:", error);
  }
};

// Remove sensitive data from SecureStore
export const removeSecureData = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error removing data from SecureStore:", error);
  }
};

// Log the user out by removing session data and credentials
export const logoutUser = async () => {
  try {
    await SecureStore.deleteItemAsync('session'); // Remove session info
    await SecureStore.deleteItemAsync('username'); // Remove username
    await SecureStore.deleteItemAsync('password'); // Remove password
  } catch (error) {
    console.error("Error logging out and clearing session data:", error);
  }
};
