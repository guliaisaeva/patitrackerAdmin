// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// export interface Device {
//     _id: string;
//     DeviceID: string;
//     Latitude: number;
//     Longitude: number;
//     Battery: number;
//     LastValueUpdated: number;
//     IsWalkStarted: boolean;
//     WalkOid: string | null;
//     BatteryLowNotified: boolean;
//     VirtualFence: {
//       ShapeType: number;
//       Radius: number;
//       CenterPoint: null | {
//         Latitude: number;
//         Longitude: number;
//       };
//       Corners: Array<{
//         Latitude: number;
//         Longitude: number;
//       }>;
//     };
//     IsOutOfVirtualFence: boolean;
//     IsActive: boolean;
//     RealtimeTrackingStatusId: number;
//     RealtimeTrackingStatus: string;
//     RealtimeTrackingValidTill: number;
//     FcmToken: string | null;
//     GpsLocation: boolean;
//     WifiLocation: boolean;
//     LbsLocation: boolean;
//     BleLocation: boolean;
//     BeaconLocation: boolean;
//     HomeWifiLocation: boolean;
//     InCharging: boolean;
//     FullyCharged: boolean;
//     Rebooted: boolean;
//     HistoricalData: boolean;
//     AgpsValid: boolean;
//     BleConnected: boolean;
//     Indoors: boolean;
//     WorkMode: number;
//     GsmSignalStrength: number;
// }

// interface DevicesState {
//   devices: Device[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: DevicesState = {
//   devices: [],
//   status: "idle",
//   error: null,
// };

// const token = process.env.NEXT_PUBLIC_API_TOKEN;
// export const getDevicesFromMongo = createAsyncThunk(
//     "devices/fetchDevices",
//     async () => {
//       const response = await fetch("http://localhost:4000/devices");
//       if (!response.ok) {
//         throw new Error("Failed to fetch devices");
//       }
//       const data = await response.json();
//   ;
//   return data as Device[];
//     }
//   );

// export const mongoDbSlice = createSlice({
//   name: "mongoDbSlice",
//   initialState,
//   reducers: {
//     updateDeviceRealtime: (state, action: PayloadAction<Device>) => {
//       const index = state.devices.findIndex((d) => d.DeviceID === action.payload.DeviceID);
//       if (index !== -1) {
//         state.devices[index] = action.payload;
//       } else {
//         state.devices.push(action.payload); // optionally handle new device
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getDevicesFromMongo.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getDevicesFromMongo.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.devices = action.payload;
//       })
//       .addCase(getDevicesFromMongo.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message || "Failed to load devices";
//       });
//   },
// });

// export const selectDevicesFromMongo = (state: { devices: DevicesState }) => state.devices.devices;

// export default mongoDbSlice.reducer;
