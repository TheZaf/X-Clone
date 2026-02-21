import Posts from '../../components/common/posts.jsx'
import Header from '../../components/common/header.jsx'

const Home = () => {
  return (
          <div className="flex-[4_4_0]  max-w-[600px] border-r border-zinc-700 min-w-0">    
             <Header/> 
             <Posts/>
          </div>
  );
}

export default Home
