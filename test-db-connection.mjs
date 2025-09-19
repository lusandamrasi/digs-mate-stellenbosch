import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    await client.connect();
    console.log('✅ Database connected successfully!');
    
    // Check if Better Auth tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'account', 'session', 'verification')
      ORDER BY table_name;
    `);
    
    console.log('📋 Existing tables:', result.rows.map(row => row.table_name));
    
    if (result.rows.length === 0) {
      console.log('❌ No Better Auth tables found!');
      console.log('📝 You need to run the migration SQL in Supabase.');
    } else if (result.rows.length < 4) {
      console.log('⚠️  Some Better Auth tables are missing!');
      console.log('📝 You need to run the complete migration SQL in Supabase.');
    } else {
      console.log('✅ All Better Auth tables exist!');
      
      // Check user table structure
      const userTable = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user' 
        ORDER BY ordinal_position;
      `);
      
      console.log('👤 User table columns:', userTable.rows.map(row => `${row.column_name} (${row.data_type})`));
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
