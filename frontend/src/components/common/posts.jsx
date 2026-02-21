import Post from "./post.jsx";
import PostSkeleton from "../skeletons/postskeleton.jsx";

import { useQuery } from "@tanstack/react-query";

const Posts = ({feedType,username,userId}) => {

	// const isLoading = false;

	const getPostsEndpoint=()=>{
		switch(feedType){
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostsEndpoint();
	const {data:posts,isLoading} = useQuery({
		queryKey:["posts"],
		queryFn: async()=>{
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Failed to fetch posts");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		}

	})

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div className=" w-full">
					{posts.map((p) => (
						<Post key={p._id} post={p} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;