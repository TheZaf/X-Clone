import React from 'react'
import { images } from '../../assets/assets';
import CustomIcon from '../../assets/custom';
import {data, Link, Navigate} from 'react-router-dom';
import { MdHomeFilled } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {fetchAuthUser} from "../common/auth.jsx";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const sidebar = () => {
	const navigate = useNavigate();

	const{data:authUser} = useQuery({
		queryKey:["authUser"],
		queryFn:fetchAuthUser,
		retry:false,
	});
	// const { data: authUser } = useQuery({queryKey:["authUser"]});

	 const queryClient = useQueryClient();
	const { mutate:logout, isPending,isError,error} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Logged out successfully");
			navigate("/login")	
			// queryClient.invalidateQueries({ queryKey: ["authUser"] });
			  queryClient.setQueryData(["authUser"], null);
				
		},
		onError: () => {
			console.log("Logout error:", error);
			toast.error("Logout failed");
		},
	});
  return (
	
		<div className='h-screen w-16 md:w-[280px] md:ml-10 border-r border-zinc-700 flex flex-col sticky top-0'>
			<div className='flex flex-col items-center md:items-start p-2 h-full'>

				{/* X Logo */}
				<div className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer transition duration-200 mb-2'>
					<img src={images.xlogo} alt="X Logo" />
				</div>

				{/* Menu Items */}
				<div className='flex flex-col w-full font-semibold text-xl text-white gap-1'>

					<Link to="/">
						<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
							<img src={images.home} className='min-w-[24px]' />
							<h1 className='hidden md:block'>Home</h1>
						</div>
					</Link>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<img src={images.explore} className='min-w-[24px]' />
						<h1 className='hidden md:block'>Explore</h1>
					</div>

					<Link to="/notification">
						<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
							<img src={images.notification} className='min-w-[24px]' />
							<h1 className='hidden md:block'>Notification</h1>
						</div>
					</Link>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<img src={images.messages} className='min-w-[24px]' />
						<h1 className='hidden md:block'>Messages</h1>
					</div>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<div className='min-w-[24px] flex items-center'><CustomIcon /></div>
						<h1 className='hidden md:block'>Grok</h1>
					</div>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<img src={images.community} className='min-w-[24px]' />
						<h1 className='hidden md:block'>Community</h1>
					</div>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<img src={images.xlogo} className='h-5 w-5 min-w-[24px]' />
						<h1 className='hidden md:block'>Premium</h1>
					</div>

					<Link to={`/profile/${authUser?.username}`}>
						<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
							<img src={images.profile} className='min-w-[24px]' />
							<h1 className='hidden md:block'>Profile</h1>
						</div>
					</Link>

					<div className='flex items-center h-[50px] hover:bg-zinc-800 cursor-pointer transition duration-200 rounded-[70px] px-2.5 gap-4'>
						<img src={images.more} className='min-w-[24px]' />
						<h1 className='hidden md:block'>More</h1>
					</div>

					{/* Post Button */}
					<button className='bg-white text-black font-bold h-12 w-12 md:w-full rounded-full mt-2'>
						<span className='hidden md:block'>Post</span>
						<span className='md:hidden text-xl'>+</span>
					</button>
				</div>

				{/* User Profile Section */}
				<div className='mt-auto mb-4 w-full'>
					<Link
						to={`/profile/${authUser?.username}`}
						className='flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] py-2 px-2 rounded-full'
					>
						<div className='avatar'>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='hidden md:flex justify-between flex-1 items-center'>
							<div>
								<p className='text-white font-bold text-sm  truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				</div>

			</div>
		</div>
  )
}

export default sidebar

