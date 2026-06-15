import { useEffect, useState } from 'react'
import useAxios from "../hooks/axios";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TABS = ["all", "published", "draft", "in_review", "scheduled"];

const STATUS_STYLES = {
  published: "bg-green-100 text-green-700",
  draft:     "bg-yellow-100 text-yellow-700",
  review:    "bg-purple-100 text-purple-700",
  scheduled: "bg-blue-100 text-blue-700",
};
function Category() {
  const axios = useAxios();
  const navigate =useNavigate();
    const [posts,setPosts]=useState([]);
    const [activeTab,setActiveTab]=useState('all');
    const [loading, setLoading]= useState(true);
    const [error, setError]= useState(null);
    const [search,setSearch]=useState("");

 


useEffect(() => {
    async function fetchPosts() {
  setLoading(true);
  try {
    const {data} = await axios.get(`/news/myposts?tab=${activeTab}`);
    setPosts(data.posts);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
fetchPosts();
    const interval = setInterval(() => {
    fetchPosts();
  }, 30000);

  return () => clearInterval(interval); 
}, [activeTab]);
console.log("Current Live Posts Array:", posts);
const displayed = search? posts.filter((p)=>p.title.toLowerCase().includes(search.toLowerCase()))
:posts;
const handleDelete=async(id)=>{
 try{
  setLoading(true);
  setError("");
  const {data}= await axios.delete(`/news/delete/${id}`);
  if(data.success){
toast.success("post deleted successfully");

setPosts(prev=>prev.filter((post)=>post._id!==id));


  }
 }catch(err){
  setError(err?.response?.data?.message);
 }
 finally{
  setLoading(false);
 }
}

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
         <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Dashboard 
            </button>
          </div>
     
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium text-gray-900">Articles</h1>
        <button onClick={()=>navigate('/addpost')} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700">
          + New article
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">

        
        <div className="flex border-b border-gray-200 px-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3 py-3 text-sm capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-violet-600 text-violet-700 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

       
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-56 text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-violet-400"
          />
          <span className="ml-auto text-xs text-gray-400">
            {displayed.length} article{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {error && (
          <div className="mx-4 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

       
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5 w-1/2">Title</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
            
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))
            ) : displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-sm text-gray-400 py-12">
                  No {activeTab === "all" ? "" : activeTab} articles found.
                </td>
              </tr>
            ) : (
              displayed.map(post => (
                <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 truncate max-w-xs">{post.title}</p>
                  </td>
                 
                  <td className="px-4 py-3 text-sm text-gray-500">{post.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[post.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {post.updatedAt
                      ? new Date(post.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                      onClick={()=>navigate(`/editpost/${post._id}`)}
                      className="text-xs px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100">
                        Edit
                      </button>
                      <button onClick={()=>handleDelete(post._id)} className="text-xs px-2.5 py-1 border border-red-100 rounded-md text-red-500 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Category
