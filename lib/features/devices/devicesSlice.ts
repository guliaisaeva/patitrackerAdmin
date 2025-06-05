import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export const getAllDevices = async (): Promise<Devices[]> => {
  const response = await fetch(CONST.getAllDeviceURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch users: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};

export const getDevicesAsync = createAsyncThunk(
  "devices/getDevices",
  async () => {
    const devicesData = await getAllDevices();
    return devicesData;
  }
);

export const addDeviceAsync = createAsyncThunk(
  "devices/addDevice",
  async (deviceToAdd: DeviceToAdd[], { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.addDeviceURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceToAdd),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Failed to add device:", errorDetail);
        return rejectWithValue(`Failed to add device: ${errorDetail.message}`);
      }

      const data = await response.json();
      if (typeof data !== "object" || data === null) {
        console.error("Unexpected response format or no device added:", data);
        return rejectWithValue("Invalid response format or no device added.");
      }
      console.log("Device added successfully:", data);
      return data;
    } catch (error: any) {
      console.error("Error adding device:", error);
      return rejectWithValue(
        error.message || "An error occurred while adding the device."
      );
    }
  }
);

export const deleteDeviceAsync = createAsyncThunk(
  "devices/deleteDevice",
  async (deviceId: number | string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${CONST.deleteDeviceURL}?deviceId=${deviceId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to delete manager: ${response.statusText} - ${errorDetail}`
        );
      }

      // Optionally, return some data if needed upon successful deletion
      // const data = await response.json();
      // return data.data;
      return deviceId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDeviceDetails = async (deviceId: string) => {
  const response = await fetch(`${CONST.getDeviceDetailURL}?Id=${deviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch device details: ${response.statusText} - ${errorDetail}`
    );
  }
  const data = await response.json();
  return data.data;
};

export const getDeviceDetailsAsync = createAsyncThunk(
  "devices/getDeviceDetails",
  async (deviceId: string) => {
    const deviceData = await getDeviceDetails(deviceId);
    return deviceData;
  }
);

export const getAllDevicesForConnectSim = async (): Promise<
  DevicesWithSim[]
> => {
  const response = await fetch(CONST.getAllDeviceForConnectSimURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch devices: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};

export const getDevicesForConnectSimAsync = createAsyncThunk(
  "devices/getDevicesForConnectSim",
  async () => {
    const devicesData = await getAllDevicesForConnectSim();
    return devicesData;
  }
);

export interface Devices {
  id: number;
  simCardId: number | null;
  simNumber: string;
  deviceNumber: string;
  deviceModel: string;
  registerDate: string;
  isActive: boolean;
  isFault: boolean;
}
interface DeviceDetail {
  deviceId: string;
  simNumber: string | null;
  activityState: boolean;
  memberShipStartDate: string | null;
  memberShipEndDate: string | null;
  userName: string | null;
  userImageUrl: string | null;
  email: string | null;
  petName: string | null;
  petImageUrl: string | null;
}
export interface DeviceToAdd {
  deviceNumber: string;
  deviceModel: string;
  isDeviceToSim: boolean;
  simCardId: number;
}

interface DevicesWithSim {
  deviceId: number;
  deviceNumber: string;
}

interface DeviceSliceState {
  devices: Devices[] | null;
  deviceDetails: DeviceDetail | null;
  devicesWithSim: DevicesWithSim[] | null;
  devicesAdd: DeviceToAdd[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DeviceSliceState = {
  devices: [],
  deviceDetails: null,
  devicesWithSim: [],
  devicesAdd: [],
  status: "idle",
  error: null,
};

export const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    clearDeviceDetails: (state) => {
      state.deviceDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDevicesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getDevicesAsync.fulfilled,
        (state, action: PayloadAction<Devices[]>) => {
          state.status = "succeeded";
          state.devices = action.payload;
        }
      )
      .addCase(getDevicesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(deleteDeviceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteDeviceAsync.fulfilled,
        (state, action: PayloadAction<number | string>) => {
          state.status = "succeeded";
        }
      )
      .addCase(deleteDeviceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(getDeviceDetailsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getDeviceDetailsAsync.fulfilled,
        (state, action: PayloadAction<DeviceDetail>) => {
          state.status = "succeeded";
          state.deviceDetails = action.payload;
        }
      )
      .addCase(getDeviceDetailsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(getDevicesForConnectSimAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getDevicesForConnectSimAsync.fulfilled,
        (state, action: PayloadAction<DevicesWithSim[]>) => {
          state.status = "succeeded";
          state.devicesWithSim = action.payload;
        }
      )
      .addCase(getDevicesForConnectSimAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(addDeviceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addDeviceAsync.fulfilled,
        (state, action: PayloadAction<DeviceToAdd[]>) => {
          state.status = "succeeded";
          if (Array.isArray(action.payload)) {
            state.devicesAdd.push(...action.payload);
          } else {
            state.devicesAdd.push(action.payload);
          }
          state.error = null;
        }
      )
      .addCase(addDeviceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to add device";
      });
  },
});
export const { clearDeviceDetails } = devicesSlice.actions;

export const selectDevices = (state: RootState) => state.devices.devices;
export const selectDevicesStatus = (state: RootState) => state.devices.status;
export const selectDevicesError = (state: RootState) => state.devices.error;
export const selectDeviceDetails = (state: RootState) =>
  state.devices.deviceDetails;
export const selectDevicesWithSim = (state: RootState) =>
  state.devices.devicesWithSim;

export default devicesSlice.reducer;
