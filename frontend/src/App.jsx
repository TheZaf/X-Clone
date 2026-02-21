import { Routes,Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import Home from './pages/home/home.jsx'
import Login from './pages/auth/login/login.jsx'
import Signup from './pages/auth/signup/signup.jsx'
import Sidebar from './components/common/sidebar.jsx'
import RightPanel from './components/common/suggest.jsx'
import NotificationPage from './pages/noticifation/notification.jsx'
import ProfilePage from './pages/profile/profile.jsx'
import LoadingSpinner from './components/common/loading.jsx';
import { fetchAuthUser } from './components/common/auth.jsx';



function App() {
  //  const  {data:authUser,isLoading} = useQuery({
  //   queryKey:["authUser"],
  //   queryFn: async()=>{
  //     try {
  //       const res = await fetch("/api/auth/me");
  //       const data = await res.json();
  //       if(data.error) return null;
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch auth user");
  //       }
  //       console.log("Auth User:", data);
  //       return data;
  //     } catch (error) {
  //       throw new Error(error);
  //     }
  //   },
  //   retry: false,
  // });

//   const fetchAuthUser = async () => {
//   try {
//     const res = await fetch("/api/auth/me");
//     const data = await res.json();

//     if (data.error) return null;
//     if (!res.ok) {
//       throw new Error("Failed to fetch auth user");
//     }

//     return data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };



const { data: authUser, isLoading } = useQuery({
  queryKey: ["authUser"],
  queryFn: fetchAuthUser,
  retry: false,
});

  if(isLoading){
   return(
     <div className='h-screen flex items-center justify-center'>
      <LoadingSpinner size='lg'/>
    </div>
   )
  }

  return (
    <>
    <Toaster position='top-center' reverseOrder={false}/>
    <div className="flex bg-black min-h-screen text-white">
      {authUser && <Sidebar/>}
      <Routes>
        <Route path='/' element={authUser ? <Home/> : <Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/"/>}/>
        <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to="/"/>}/>
        <Route path='/notification' element={authUser ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      {authUser && <RightPanel/>} 
    </div>
    
    </>
  )
}

export default App

