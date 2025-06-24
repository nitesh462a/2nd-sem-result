import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';

export async function POST(req) {
  try {
    const { scholarId } = await req.json();
    const trimmedId = scholarId.trim();

    const filePath = path.join(process.cwd(), 'public', 'result.xlsx');
    const fileBuffer = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Skip headers which has no use 
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(5);



    for (const row of data) {
      const id = String(row[2]).trim();
      console.log(" Comparing:", id);
      if (id === trimmedId) {
        console.log(" Match found:", row);
        return NextResponse.json({ success: true, result: row });
      }
    }

    console.log("No match found");
    return NextResponse.json({ success: false, message: 'Scholar ID not found' });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
} 


