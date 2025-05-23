import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const initializeUserFromStorage = createAsyncThunk(
  "users/initializeFromStorage",
  async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateUserProfile/${userData.get("email")}`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const user = response.data.user;
      return user;
    } catch (error) {
      console.log(error);
      alert("Failed to update profile. Please try again.");
      throw error; 
    }
  }
);

export const logout = createAsyncThunk("users/logout", async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    console.log(response);
    alert("You are logged out");
    localStorage.removeItem("user");
    return true; 
  } catch (error) {
    console.log(error);
    alert("Failed to log out. Please try again.");
    throw new Error("Logout failed");
  }
});

export const login = createAsyncThunk("users/login", async (userData) => {
try {
  const response = await axios.post(`${API_URL}/login`, {
    email: userData.email,
    password: userData.password,
  });
  console.log("Login response:", response.data);
  const user = response.data.user;
  return user;
} catch (error) {
  console.error("Login error details:", error);
  console.error("API URL used:", `${API_URL}/login`);
  throw error;
}
});

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/registerUser`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      console.log(response);
      const user = response.data.user;
      alert("Registered in successfully");
      return user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.user = state.user.filter((user) => user.email !== action.payload);
    },
    updateUser: (state, action) => {
      state.value = state.value.map((user) => {
        if (user.email === action.payload.email) {
          return {
            ...user,
            name: action.payload.name,
            password: action.payload.password,
          };
        }
        return user;
      });
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    resetState: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload || null;
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null; 
        state.isSuccess = false;
        state.isError = false;
        localStorage.removeItem("user"); 
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
    
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        console.error("Failed to update profile:", action.error.message);
      });
  },
});

export const { addUser, deleteUser, updateUser, setUser, resetState } =
  userSlice.actions;
export default userSlice.reducer;
