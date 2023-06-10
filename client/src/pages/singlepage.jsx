import axios from "axios";
import { useState,useEffect } from "react"

function singlepage() {
    const [postData, setPostData] = useState({});
    useEffect(()=>{
        axios.get(`http://localhost:3000/posts/${id}`)
        .then((response) => setPostData(response.data))
        .catch((error) => console.log(error));
    },[])
  return (
    <>
   <img
            src={`http://localhost:3000/uploads/${postData.image}`}
            alt={postData.image}
            style={{
              marginTop: "20px",
              width: "700px",
              height: "350px",
              objectFit: "cover",
            }}
          />
    </>
  )
}

export default singlepage