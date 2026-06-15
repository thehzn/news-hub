
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';
import toast from 'react-hot-toast';

function Profile() {
    const navigate =useNavigate();
    const axios =useAxios();
     
 
    const user = useSelector((state)=>state.auth.user);

 const name = user.name || user.username || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
 
const handleSignOut =async()=>{
    try{
       
        const {data}=await axios.post('/admin/signout');
         if(data.success){
          toast.success("signed out successfully");
          navigate('/');  
         }
    }
    catch(err){
        console.log(err?.response?.data?.message);

    }
   
}


  return (
    <div>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 space-y-5">
 
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold">
            {initials}
          </div>
          <p className="text-base font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
 
        <hr className="border-gray-100" />
 
        {/* Info */}
        <div className="space-y-3 text-sm">
          {user.username && (
            <div className="flex justify-between">
              <span className="text-gray-400">Username</span>
              <span className="text-gray-800 font-medium">{user.username}</span>
            </div>
          )}
          {user.createdAt && (
            <div className="flex justify-between">
              <span className="text-gray-400">Joined</span>
              <span className="text-gray-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
          )}
        </div>
 
        <hr className="border-gray-100" />
 
        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate("/changepass")}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Change password
          </button>
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 rounded-xl bg-red-50 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
          >
            Sign out
          </button>
          
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center py-2"
            >
              ←  back to dashboard
            </button>
         
        </div>
 
      </div>
    </div>

    </div>
  )
}

export default Profile
