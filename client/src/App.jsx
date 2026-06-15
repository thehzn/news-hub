import { Route, Routes,Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Category from "./pages/Category"
import AddPost from "./pages/AddPost"
import EditPost from "./pages/EditPost"
import Profile from "./pages/Profile"
import ChangePassword from "./pages/ChangePassword"
import ProtectedRoute from "./pages/ProtectedRoute"
import PublicHomePage from "./pages/PublicHomePage"
import SinglePost from "./pages/SinglePost"
import PublicCategory from "./pages/PublicCategory"


function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<PublicHomePage />} />
      <Route path='/single/:id' element={<SinglePost/>}/>
      <Route path='/publiccategory' element={<PublicCategory/>}/>
        
        {/* Anyone can view the login gate page */}
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Home/>}/>

      <Route path="/category" element={<Category/>}/>
     <Route path="/addpost" element={<AddPost/>}/>
     <Route path='/editpost/:id' element={<EditPost/>}/>
     <Route path='/profile' element={<Profile/>}/>
     <Route path="/changepass" element={<ChangePassword/>}/></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
   
    </>
  )
}

export default App
