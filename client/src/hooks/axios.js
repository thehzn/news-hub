//  import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { signout } from "../redux/authSlice";
// import axios from "axios";
// import { useEffect,useMemo } from "react";

// const useAxios =()=>{
// const dispatch =useDispatch();
// const navigate = useNavigate();

//     const instance =useMemo(() => axios.create({
//        baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
//         withCredentials:true
//     }),[]);

//     useEffect(()=>{
//         const responseInterceptor = instance.interceptors.response.use(
// (res)=>res,
// (error)=>{
//     if(error.response){
//         const {status} =error.response
//         if(status==401){
            
//             dispatch(signout());
//             navigate('/login');


//         }
//         if(status==403){
//             navigate('/unauthorised');
//         }

    
//     }
//     return Promise.reject(error);

// }
//         );
    

// return()=>{
//     instance.interceptors.response.eject(responseInterceptor);
// }



//     },[ dispatch , navigate,instance]);
//     return instance;
// }

// export default useAxios;

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "../redux/authSlice";
import axios from "axios";
import { useEffect, useMemo } from "react";

const useAxios = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

//   const instance = useMemo(() => axios.create({
//     baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
//     withCredentials: true
//   }), []);
const instance = useMemo(() => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });
}, []);

  useEffect(() => {
    // Request interceptor - attach token from localStorage
    const requestInterceptor = instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - handle errors
    const responseInterceptor = instance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response) {
          const { status } = error.response;
          if (status == 401) {
            localStorage.removeItem('token');
            dispatch(signout());
            navigate('/login');
          }
          if (status == 403) {
            navigate('/unauthorised');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };

  }, [dispatch, navigate, instance]);

  return instance;
};

export default useAxios;