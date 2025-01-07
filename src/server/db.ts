import { ItemRequest } from "@/lib/types/request";
import { DatabaseConnectionError } from "@/lib/errors/internalExceptions";

// Create mongodb connection and export it
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const user = process.env.DB_USER;
const encodedPassword = encodeURIComponent(process.env.DB_PASSWORD || '');
if (!user || !encodedPassword) {
  console.error('Missing user or password');
  process.exit(1);
}

const uri = `mongodb+srv://${user}:${encodedPassword}@cluster0.ihhec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
let client: typeof MongoClient;

// Returns a connection to the mongodb database
// If null, then the connection failed
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: ServerApiVersion.v1,
    });
    try {
      await client.connect();
    } catch (e) {
      throw new DatabaseConnectionError();
    }
  }
  return client;
}

let counter = 1;
export function generateId(): number {
  const timestamp = Math.floor(new Date().getTime() / 1000) % 100000;
  const randInt = Math.floor(Math.random() * 100);
  const ret = "" + counter++ + timestamp + randInt;
  return parseInt(ret);
}

export async function uploadNewRequestToDatabase(entry: ItemRequest) {
  const connection = await connectToDatabase();
  if (!connection) {
    return false;
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  await collection.insertOne(entry);
}

export async function getItemRequestsFromDatabase(): Promise<ItemRequest[]> {
  const connection = await connectToDatabase();
  if (!connection) {
    throw new DatabaseConnectionError();
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  const sortedRequests = await collection.find().sort({"requestCreatedDate": -1}).toArray();

  let filteredRequests = sortedRequests;

  return filteredRequests;
}

export async function editItemRequestById(id: number, status: string): Promise<ItemRequest | null> {
  const connection = await connectToDatabase();
  if (!connection) {
    throw new DatabaseConnectionError();
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  const request = await collection.findOne({ id: id });
  if (!request) {
    return null;
  }

  request.status = status;
  const date = new Date();
  request.lastEditedDate = date;
  await collection.updateOne({ id: id },
    { 
      $set: { 
        status: status,
        lastEditedDate: date,
      }
    }
  );

  return request;
}

async function deleteItemRequestById(id: number): Promise<boolean> {
  const connection = await connectToDatabase();
  if (!connection) {
    throw new DatabaseConnectionError();
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  const request = await collection.findOne({ id: id });
  if (!request) {
    return false;
  }

  await collection.deleteOne({ id: id });
  return true;
}

export async function deleteItemsByDate(
  beginDate: Date, endDate: Date
): Promise<ItemRequest[]> {
  const connection = await connectToDatabase();
  if (!connection) {
    throw new DatabaseConnectionError();
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  await collection.deleteMany({
    requestCreatedDate: {
      $gte: beginDate,
      $lte: endDate,
    }
  });

  const requests = await collection.find({
    requestCreatedDate: {
      $gte: beginDate,
      $lte: endDate,
    }
  }).toArray();
  return requests;
}

export async function editItemsByDate(
  beginDate: Date, endDate: Date, oldStatus: string, newStatus: string
): Promise<ItemRequest[]> {
  const connection = await connectToDatabase();
  if (!connection) {
    throw new DatabaseConnectionError();
  }

  const db = connection.db("Crisis_Compass");
  const collection = db.collection("requests");
  const requests = await collection.find({
    requestCreatedDate: {
      $gte: beginDate,
      $lte: endDate,
    },
    status: oldStatus,
  }).toArray();

  for (const request of requests) {
    request.status = newStatus;
    const date = new Date();
    request.lastEditedDate = date;
    await collection.updateOne({ id: request.id },
      { 
        $set: { 
          status: newStatus,
          lastEditedDate: date,
        }
      }
    );
  }

  return requests;
}