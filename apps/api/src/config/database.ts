import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

// Helps resolve MongoDB Atlas SRV records on Windows when the system DNS blocks SRV queries.
dns.setDefaultResultOrder("ipv4first");
if (env.mongoConnection.startsWith("mongodb+srv://")) {
  const dnsServers = process.env.DNS_SERVERS?.split(",").map((s) => s.trim()) ?? [
    "8.8.8.8",
    "8.8.4.4",
    "1.1.1.1",
  ];
  dns.setServers(dnsServers);
}

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    mongoose.set("strictQuery", true);

    connectionPromise = mongoose.connect(env.mongoConnection, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    await connectionPromise;
    logger.info("MongoDB connected");
  } catch (err) {
    connectionPromise = null;
    const message =
      err instanceof Error ? err.message : "Unknown MongoDB connection error";
    logger.error("MongoDB connection failed", { error: message });
    throw new Error(
      `MongoDB connection failed: ${message}. Check MONGO_CONNECTION in .env and your network/DNS (Atlas SRV requires DNS access).`
    );
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
  logger.info("MongoDB disconnected");
}
