'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function ResultPage() {
  const [scholarId, setScholarId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [subjectNames, setSubjectNames] = useState('')
  
  
   useEffect(() => {
    const subjid = scholarId.slice(2, 4);
    const subid = Number(subjid);
    console.log('subid:', subid);

    if ([11, 15, 16].includes(subid)) {
      setSubjectNames([
        'CE 102',
        'CH 101',
        'CH 111',
        'CS 101',
        'CS111',
        'EC101',
        'EC111',
        'MA102',
        'ME111'
      ]);


       




    }else{
       setSubjectNames([
        'CE 101',
        'EE 101',
        'EE 111',
        'HS 101',
        'HS 111',
        'MA 102',
        'ME 101',
        'PH 101',
        'PH 111'
      ]);
     
    }
  }, [scholarId]); 





  const handleSubmit = async () => {
    setError('');
    setResult(null);

    if (!scholarId.trim()) {
      setError('Please enter a Scholar ID');
      return;
    }

    try {
      const res = await axios.post('/api/result', {
        scholarId: scholarId.trim()
      });

      if (res.data.success) {
        console.log('Full result data:', res.data.result); 

       const cleandata=res.data.result.filter(item => item!== null);
       console.log(cleandata);
        setResult(cleandata);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const renderSubjects = () => {
    if (!result) return null;

    
     


    const subjects = [];
    for (let i = 2, idx = 0; idx < 9; i += 2, idx++) {
      const marks = result[i];
      const grade = result[i+1];
      const name = subjectNames[idx] || `Subject ${idx + 1}`;
      if (marks !== undefined && grade !== undefined) {
        subjects.push({ name, marks, grade });
      }
    }

    return (
      <ul className="mt-4 space-y-2">
        {subjects.map((s, idx) => (
          <li key={idx} className="p-3 bg-gray-100 rounded shadow">
            <p className="font-semibold">📘 {s.name}</p>
            <p>Pointer: {s.marks}</p>
            <p>Grade: {s.grade}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Check Result by Scholar ID</h2>
      <input
        type="text"
        className="w-full border p-2 rounded mb-3"
        placeholder="Enter Scholar ID (e.g., 2411039)"
        value={scholarId}
        onChange={(e) => setScholarId(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Get Result
      </button>

      {result && (
        <div className="mt-6 bg-green-50 p-4 rounded shadow space-y-3">
          <p className="font-bold text-green-800">🎓 Name:</p>
          <p className="font-bold text-green-800">🆔 Scholar ID: {result[1]}</p>

          {renderSubjects()}

          <div className="mt-4 text-green-700 font-semibold">
            <p>📊 Tota credit: {result[20]}</p>
            <p>📊 SGPA: {result[21]}</p>
            <p>🎯 CGPA: {result[22]}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}





