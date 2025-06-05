import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://pati:Pinarbasi12!@185.46.55.208:27017,185.46.55.208:27018,185.46.55.208:27019/PatiTest/?authSource=admin&replicaSet=rs0";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
