import { useState } from "react";
import useAxios from '../hooks/axios';
import { useNavigate } from "react-router-dom";
const CATEGORIES = ["tech", "business", "entertainment", "general", "lifestyle"];

export default function AddPost() {
  const axios = useAxios();
  const navigate =useNavigate();
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "draft",
    imageUrl:"",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = async(e,targetStatus) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) {
      setError("Please fill out all required fields.");
      return;
    }
    try{
setLoading(true);
setError("");

const finalFormData={...formData,status:targetStatus};
const {data} = await axios.post('/news/create',finalFormData);
if(data.success){
  console.log("Submitting Post Data:", finalFormData);
  navigate('/category');
}
    }catch(err){
      console.log(err);
      setError(err?.response?.data?.message);
    }
    finally{
      setLoading(false);
    }
    
  
  };
  

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
       {error && <div >⚠ {error}</div>}
       {loading?<div><p>loading articles</p></div> : (<div>
         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Articles
            </button>
          </div>
        <h2 className="text-lg font-medium text-gray-900">Create New Article</h2>
        <p className="text-xs text-gray-500 mt-0.5">Fill in the details to draft or publish a new post.</p>
      </div>
    
      <form className="p-6 space-y-5">
        
       
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Breaking News: Major Tech Update"
            required
            className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400"
          />
        </div>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg bg-white outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-700 invalid:text-gray-400"
            >
              <option value="" disabled hidden>Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
 <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="e.g.,https://placehold.co/40x40?text=News"
            required
            className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400"
          />
        </div>
         
        </div>
   
        {formData.status === "scheduled" && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-fadeIn">
            <label htmlFor="scheduledAt" className="block text-sm font-medium text-blue-900 mb-1.5">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              required={formData.status === "scheduled"}
              className="w-full sm:w-auto text-sm px-3.5 py-2 border border-blue-200 rounded-lg outline-none bg-white text-gray-700 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-xs text-blue-600 mt-1.5">
              This post will remain hidden until the selected local timestamp passes.
            </p>
          </div>
        )}

     
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1.5">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your article body here..."
            required
            className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400 resize-none"
          />
        </div>

      
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={(e)=>handlePublish(e,"draft")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Save draft
          </button>
          <button
            onClick={(e)=>handlePublish(e,"published")}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Save and Publish
          </button>
         
        </div>

      </form>
       </div>)}
      
     

     
    </div>
  );
}