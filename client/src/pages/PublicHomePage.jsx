import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';

export default function PublicHomePage() {
  const navigate = useNavigate();
  const axios = useAxios();
  const [posts, setposts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchposts = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get('/news/getposts');
        if (data.success) {
          setposts(data.publicPosts);
          console.log(data.publicPosts);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchposts();
  }, [axios]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
     
      <section className="bg-gray-900 border-b border-gray-800 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
  🗞 NewsHub
</div>
          <h1 className="text-4xl font-extrabold tracking-tight  text-white">
            The Public News Feed
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Welcome to the central platform portal. Click below to view articles curated by distinct topics.
          </p>
          
          <div className="pt-2">
            <button 
              onClick={() => navigate('/publiccategory')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-sm transition-colors"
            >
              Browse by Category →
            </button>
          </div>
        </div>
      </section>

    
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm">Loading stream items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

       
        {!loading && !error && (
          <main className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-3">
              Latest Stream
            </h2>

            {posts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No articles found in the feed directory.</p>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <article 
                    key={post._id} 
                    onClick={() => navigate(`/single/${post._id}`)}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Post Image Cover Block */}
                    <div className="md:w-1/3 bg-gray-100 relative min-h-[200px] md:min-h-full overflow-hidden">
                      <img 
                        src={post.imageUrl || `https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=600&q=80`} 
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                        
                          e.target.src = "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>

                  
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span>•</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      <div>
                        <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                          Read Full News →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        )}
      </div>

     
      <footer className="mt-20 border-t border-gray-200 bg-white py-8 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 NewsHub. All rights reserved.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="hover:text-gray-600 hover:underline transition-colors font-medium"
          >
           Login
          </button>
        </div>
      </footer>
    </div>
  );
}