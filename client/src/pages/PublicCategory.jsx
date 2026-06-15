import{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';

export default function PublicCategory() {
  const navigate = useNavigate();
  const axios = useAxios();

 
  const categories = ['general', 'tech', 'business', 'lifestyle', 'entertainment'];


  const [activeCategory, setActiveCategory] = useState('general');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
       
        const { data } = await axios.get(`/news/getposts?category=${activeCategory}`);
        
        if (data.success) {
          setPosts(data.publicPosts);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load category content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [activeCategory, axios]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">
      
      
      <header className="bg-white border-b border-gray-200 py-6 px-6 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-wider mb-1"
            >
              ← Back to Main Feed
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Topic Directory</h1>
          </div>

        
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
     
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-xs font-bold capitalize rounded-xl border transition-all duration-150 ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

       
        <main>
        
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-400 text-xs mt-4">Querying {activeCategory} catalog...</p>
            </div>
          )}

       
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

         
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <p className="text-gray-500 text-sm">No articles documented under the <span className="font-semibold capitalize text-gray-700">"{activeCategory}"</span> category tier yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      onClick={() => navigate(`/single/${post._id}`)}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-150 cursor-pointer flex flex-col justify-between group"
                    >
                     
                      <div>
                        <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                          <img 
                            src={post.imageUrl || "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=600&q=80"} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        </div>

                     
                        <div className="p-5 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                      </div>

                    
                      <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-4 text-[11px] text-gray-400">
                        <span>{post.date || new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">Read Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}