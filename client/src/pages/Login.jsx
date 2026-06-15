
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';



import useAxios from '../hooks/axios';

function Login() {

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const axios =useAxios();
    const formik=useFormik({
        initialValues:{
            email:"",
            password:"",
        },
        validationSchema:Yup.object({
            email:Yup.string().email("invalid email").required("email is required"),
            password:Yup.string().min(6,"password must contain minimum of 6 characters").max(12,"password must be at most 12 characters")
        }),
       onSubmit: async(values) => {
  console.log("Submit clicked!")
  console.log(values)
  try {
    const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, values, {withCredentials: true})
    if(data.success){
      toast.success(data?.message || "Login successful!")
      console.log("response data:", data)
      localStorage.setItem('token', data.token)
      dispatch(login(data.user))
      navigate("/dashboard")
    }
  }
  catch(error){
    const errorMessage = error?.response?.data?.message || "Invalid email or password"
    toast.error(errorMessage)
  }
}})
  return (
   <div  style={{ width:"500px",margin:' 50px auto',height:'350px', backgroundColor: "#f8f9fa",   // light gray background
    borderRadius: "12px",boxSizing:'border-box',padding:'0px 20px',
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"  }}>
        <h2
  style={{
    textAlign: "center",
    marginBottom: "25px",
    fontWeight: "600",
   
    // display: "inline-block",
    paddingBottom: "5px",
  }}
>Login</h2>
      <Form onSubmit={formik.handleSubmit}>
         <Form.Group className="mb-3" controlId="formBasicemail">
        <Form.Label>Email :</Form.Label>
        <Form.Control type="email"
         placeholder="Enter email address" 
         name='email'
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         value={formik.values.email}
         />
         {formik.touched.email && formik.errors.email && 
         (
            <div style={{color:'red'}}>{formik.errors.email}</div>
         )}
        
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicpassword">
        <Form.Label>Password :</Form.Label>
        <Form.Control type="password"
         placeholder="Enter password"
         name='password'
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         value={formik.values.password}
         />
         {formik.touched.password && formik.errors.password && 
         (
            <div style={{color:'red'}}>{formik.errors.password}</div>
         )}
       
      </Form.Group>
       <Button variant="primary" style={{display:'flex',justifyContent:'center',margin:'0 auto'}} type="submit">
        Login
      </Button>
     </Form>
    </div>
  )}
export default Login