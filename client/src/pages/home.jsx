import React, { useState, useEffect } from 'react';
import axios from "axios"

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((response)=>{
      setPosts(response.data)
    })
  }, []);

  if (!posts || posts.length === 0) {
    return (
      <main className="flex flex-col justify-center items-center w-full h-full overflow-auto">
        <div className="mt-16"></div>
        <h1 className="text-2xl font-semibold text-center uppercase">
          No posts yet!
        </h1>
      </main>
    );
  }
  return (
    <main className="w-full h-screen pt-1 bg-red-300 ">
    
      {posts.map((post) => (
        <div key={post.id} className="grid grid-cols-5 grid-rows-5 gap-4 w-full h-screen pl-2">
          <div className='w-[350px] h-[300px] flex flex-col gap-2 items-center '>

                <img
                  className="h-full w-full rounded-lg"
                  src={`http://localhost:3000/uploads/${post.imageUrl}` }
                  //src={post.imageUrl}
                  alt="Post"
                  style={{width:"100%",height : "250px"}}
                  />
                  <div>
                    <p className='font-sans'>post by- <span className='font-bold'>{post.title}</span></p>
                  </div>
                  </div>
              </div>
      ))}
    </main>
  );
}

export default Home;
