import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        setError("");
       
        const { data } = await axios.get(`/news/getpostbyid/${id}`);
        if (data.success) {
          setPost(data.post);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to locate article records.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPostDetails();
  }, [id, axios]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
 
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <svg 
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to feed
          </button>
          
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Reading Mode
          </span>
        </div>
      </nav>

     
      <div className="max-w-3xl mx-auto px-6 pt-10">
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm">Parsing news document content...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm text-center">
            <h3 className="font-bold mb-1">Error Fetching Article</h3>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
            >
              Return Home
            </button>
          </div>
        )}

        
        {!loading && !error && post && (
          <article className="space-y-8 animate-fadeIn">
            
            {/* Meta Tags Headers */}
            <div className="space-y-4 text-center sm:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full capitalize">
                {post.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-gray-500 pt-2 border-b border-gray-200 pb-6">
                <span className="font-medium text-gray-800">By Administrator</span>
                <span>•</span>
                <span>
                  {post.date || new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

        
            <div className="w-full h-[250px] sm:h-[400px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-200">
              <img 
                src={post.imageUrl || "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=1200&q=80"} 
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>

          
        

      
            <div className="text-gray-800 text-lg leading-relaxed space-y-6 whitespace-pre-line tracking-normal">
              {post.content}
            </div>

          </article>
        )}
      </div>
    </div>
  );
}