import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017/otopark_db"; // MongoDB bağlantı URL'nizi buraya yazın

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('otopark_db');
    const collection = database.collection('arac_durumlari');

    const aracDurumlari = await collection.find({}).toArray();
    return NextResponse.json(aracDurumlari);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('otopark_db');
    const collection = database.collection('arac_durumlari');

    const body = await request.json();
    const result = await collection.insertOne(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}