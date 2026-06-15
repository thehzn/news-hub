

import { useEffect, useState } from "react";
import useAxios from "../hooks/axios";
import { Link, useNavigate } from 'react-router-dom';


function Home() {
  const axios = useAxios();
  const navigate = useNavigate();
   const [loading,setLoading]=useState(false);
   const [error,setError]=useState(null);
  const [stats,setStats]=useState({
    published:0,
    draft:0,
    in_review:0,
    scheduled:0,
  });

  useEffect(()=>{
    const fetchstats=async()=>{
  try{
    setLoading(true);
    setError("");
    const {data}= await axios.get("/admin/getstats");
    if(data.success){
      setStats({
         published:data.published,
    draft:data.draft,
    in_review:data.in_review,
    scheduled:data.scheduled,
      });

    }}
    catch(err){
      setError(err.response?.data?.message || "Failed to load stats.");
    }
    finally{
      setLoading(false);
    }

  }

  fetchstats();  
  },[]);


const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div>
      <style>
        {` .tl-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
           .tl-loading {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }
`}
      </style>
       
          {error && <div >⚠ {error}</div>}
{loading ?( <div>Loading tasks...</div>):(<div className="flex h-screen bg-gray-100">

 
  <aside className="w-64 bg-white border-r border-gray-200 p-4">
    <h2 className="text-lg font-medium mb-1">NewsDesk</h2>
    <p className="text-sm font-small mb-4">Admin Panel</p>
    <nav className="space-y-1">
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg !no-underline bg-gray-100 !text-gray-500 text-sm font-medium">Dashboard</a>

      <Link 
  to="/category" 
  className="flex items-center gap-2 px-3 py-2 rounded-lg !no-underline !text-gray-500 hover:bg-gray-50 text-sm"
>
  Articles
</Link>
     
       <Link 
  to="/profile" 
  className="flex items-center gap-2 px-3 py-2 rounded-lg !no-underline !text-gray-500 hover:bg-gray-50 text-sm"
>
 Profile
</Link>
    </nav>
  </aside>

  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 text-gray-900">
 
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
      <p className="text-sm text-gray-500 mt-1">Here is what's happening with your articles today.</p>
    </div>
    
    <div className="flex items-center gap-3 w-full sm:w-auto">
    
      <span className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-600 rounded-xl shadow-sm min-w-[120px]">
        {today}
      </span>
    
      <button 
        onClick={() => navigate('/addpost')}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-full sm:w-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add new article
      </button>
    </div>
  </div>

 
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    
  
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Published</h5>
      <div className="flex items-baseline justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">{stats.published}</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          Live
        </span>
      </div>
    </div>

    
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Draft</h5>
      <div className="flex items-baseline justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">{stats.draft}</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          Drafting
        </span>
      </div>
    </div>

   
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Review</h5>
      <div className="flex items-baseline justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">{stats.in_review}</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      </div>
    </div>

  
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
      <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scheduled</h5>
      <div className="flex items-baseline justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">{stats.scheduled}</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Queued
        </span>
      </div>
    </div>

  </div>
</main>
 

</div>)}
      
    </div>
  )
}

export default Home
