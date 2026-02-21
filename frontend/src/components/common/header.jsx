import React, { useRef, useState } from 'react'
import { images } from '../../assets/assets'
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';

import { fetchAuthUser } from './auth.jsx';
import toast from 'react-hot-toast';


const Header = () => {
  const imgRef = useRef(null)
  const[img,setImg] = useState(null);
  const[text,setText] = useState("");

  const { data: authUser} = useQuery({
  queryKey: ["authUser"],
  queryFn: fetchAuthUser,
  retry: false,
 });

  const queryClient = useQueryClient();

  const {mutate: createPost, isPending}=useMutation({
	mutationFn: async({text,img})=>{
		try {
			const res = await fetch("/api/posts/create",{
				method:"POST",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify({text,img}),
			});
			const data = await res.json();
			if(!res.ok){
				throw new Error(data.error || "failed to create post!")
			}
		} catch (error) {
			throw new Error(error)
		}
	},
	onSuccess:()=>{
		toast.success("post created!")
		queryClient.invalidateQueries({queryKey:["posts"], refetchType: "active" });
	}
  })



  const handleImgChange =  (e) =>{
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader()
      reader.onload = () =>{
        setImg(reader.result);
      };
      reader.readAsDataURL(file)
    }
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    setText("");
    setImg(null);
	createPost({text,img});
  }


  return <>
    <div className=" h-fit w-full flex border-b border-zinc-700 pb-2 flex-col  ">
    <div className='flex border-b border-zinc-700 mb-4 h-14 sticky top-0 bg-black z-50'>
      <div className=' w-1/2 items-center justify-center flex font-semibold'>for you</div>
      <div className=' w-1/2 items-center justify-center flex font-semibold' >following</div>
    </div>
         <div className="w-full h-full px-4">
                      {/* Post input area */}
                     

                     <div className='flex p-4 items-start gap-4 border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={ authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none bg-black'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-info w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-info w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-info rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"} 
					</button>
				</div>
				{/* {isError && <div className='text-red-500'>{error.message}</div>} */}
			</form>
		</div>


              </div>
    </div>
  </>
}

export default Header
