import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleImageClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (!posts || posts.length === 0) {
    return (
      <main className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-2xl font-semibold text-center uppercase">
          No posts yet!
        </h1>
      </main>
    );
  }

  return (
    <main className="parent">
      {posts.map((post) => (
        <div
          onClick={() => handleImageClick(post.id)} // Pass the postId to the handler
          key={post.id}
          className="w-[350px] height-[350px] flex flex-col items-center"
        >
          <img
            src={`http://localhost:3000/uploads/${post.imageUrl}`}
            alt="Post"
            style={{ width: "100%", height: "250px", objectFit: "contain" }}
          />
          <div>
            <p className="font-sans">
              post by- <span className="font-bold">{post.title}</span>
            </p>
          </div>
        </div>
      ))}
    </main>
  );
}

export default Home;
