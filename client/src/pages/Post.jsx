import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Post() {
  const [title, setTitle] = useState('');
  const [imageUrl, setimageUrl] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageUrl || imageUrl.width >= 300 || imageUrl.height >= 200) {
      alert('Please select an image with a resolution of at least 300x200 pixels.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('imageUrl', imageUrl);

    try {
      const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authtoken')}`,
        },
        body: formData,
      });

      if (response.status === 200) {
        console.log('posted');
        alert('Posted Your Blog');
        navigate('/');
      } else {
        console.log('not posted');
      }
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setimageUrl(file);
  };

  return (
    <main className="flex bg-white flex-col justify-center items-center w-full h-full overflow-auto">
      <div className="mt-16"></div>
      <div className="bg-white rounded-lg w-full h-full flex-1 flex flex-col">
        <h1 className="text-center text-2xl font-semibold text-[#4EEAF6] md:text-3xl">
          Post Your Blog!
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center p-3 gap-12 mt-2">
            <div className="flex flex-col w-full items-center justify-start gap-2">
              <label htmlFor="title">Image Title</label>
              <input
                id="Title"
                placeholder="Enter Title"
                value={title}
                className="w-80 md:w-2/5 border-gray-300 border-2 rounded p-2"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="text-[#4EEAF6]  text-white font-bold py-2 px-4 rounded shadow-lg"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Post;
