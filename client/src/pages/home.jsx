import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.log('Failed to fetch posts');
      }
    } catch (error) {
      console.log('Error occurred while fetching posts:', error);
    }
  }

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
    <main className="flex flex-col justify-center items-center w-full h-full">
      <div className="mt-16"></div>
      {posts.map((post) => (
        <div key={post.id} className="flex justify-center items-center w-full ">
          <div className="w-full flex flex-col m-2 bg-white hover:shadow-2xl p-3 rounded-lg shadow-sm space-y-3 justify-start items-start">
            <div className="flex flex-col lg:flex-row space-x-3">
              <div>
                <img
                  className="h-full w-full rounded-lg"
                  src={`https://picsum.photos/300/200?random=${post.id}`}
                  //src={post.imageUrl}
                  alt="Post"
                />
              </div>
              <div className="flex flex-col justify-between items-start">
                <h1 className="font-semibold whitespace-nowrap">
                  {post.heading}
                </h1>
                <div className="flex w-full justify-end">
                  <h1 className="text-sm text-gray-400 font-mono">
                    - posted by {post.aname}
                  </h1>
                </div>
              </div>
            </div>
            </div>
        </div>
      ))}
    </main>
  );
}

export default Home;
