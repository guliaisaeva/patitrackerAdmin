// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb"; 
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const deviceId = searchParams.get("DeviceID");

//     const client = await clientPromise;
//     const db = client.db("PatiTest");

//     const filter = deviceId ? { DeviceID: deviceId } : {};
//     const devices = await db.collection("Devices").find(filter, {
//       projection: {
//         _id: 0,
//         DeviceID: 1,
//         Latitude: 1,
//         Longitude: 1,
//         Battery: 1,
//         IsActive: 1,
//         WorkMode: 1,
//         GsmSignalStrength: 1,
//         RealtimeTrackingStatusId: 1,
//         RealtimeTrackingValidTill: 1,
//       }
//     }).toArray();
//     console.log("Filtering for DeviceID:", deviceId);
//     console.log("Devices found:", devices.length);
//     return NextResponse.json(devices);
//   } catch (error) {
//     console.error("Error fetching devices:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const deviceId = searchParams.get("deviceId");

    const client = await clientPromise;
    const db = client.db("PatiTest");

    let devices;

    if (deviceId) {
      devices = await db.collection("Devices").findOne(
        { DeviceID: deviceId },
        {
          projection: {
            _id: 0,
            DeviceID: 1,
            Latitude: 1,
            Longitude: 1,
            Battery: 1,
            IsActive: 1,
            WorkMode: 1,
            GsmSignalStrength: 1,
            RealtimeTrackingStatusId: 1,
            RealtimeTrackingValidTill: 1,
          }
        }
      );

      if (!devices) {
        return NextResponse.json({ error: "Device not found" }, { status: 404 });
      }

      return NextResponse.json(devices);

    } else {
      return NextResponse.json({ error: "Missing deviceId parameter" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
