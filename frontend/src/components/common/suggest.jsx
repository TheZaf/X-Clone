import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFollow } from "../hooks/usefollow.jsx";
import LoadingSpinner from "./loading.jsx";

import RightPanelSkeleton from "../skeletons/rightpanal.jsx";


const RightPanel = () => {
	const {follow,isPending} = useFollow();
	const {data:suggestedUsers,isLoading}= useQuery({
		queryKey:["suggestedUsers"],
		queryFn: async()=>{
			try {
				const res = await fetch("/api/user/suggested");
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || "Failed to fetch suggested users");
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		}
	});
  return (
	<div className="w-[320px] hidden lg:block mx-2 ml-10 sticky top-5 h-screen overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 bg-black rounded-full border border-zinc-700 text-white placeholder-gray-400 outline-none"
        />
      </div>

      {/* What's Happening */}
      <div className=" border border-zinc-700 rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-3">What’s happening</h2>
        <div className="space-y-3 text-sm">
          <p className="text-gray-400">#React — Trending</p>
          <p className="text-gray-400">#TailwindCSS — 12.4k posts</p>
          <p className="text-gray-400">#NextJS — Developers rising</p>
        </div>
      </div>

      <div className='hidden lg:block border border-zinc-700 rounded-2xl p-4 w-full'>
			<div className='rounded-md sticky top-2'>
				<p className='font-bold mb-4'>Who to follow</p>
				<div className='flex flex-col gap-4 '>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading && suggestedUsers?.map((users) => (
							<Link
								to={`/profile/${users.username}`}
								className='flex items-center justify-between gap-4'
								key={users._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={users.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{users.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{users.username}</span>
									</div>
								</div>
								<div>
									<button
										className='bg-white text-black px-4 py-1 rounded-full font-bold'
										onClick={(e) => {
											e.preventDefault();
											follow(users._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
										{/* follow */}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>

    </div>
  );
};

export default RightPanel;