import axios from "axios";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";


function singlepage() {
    const { id } = useParams();
    const [postData, setPostData] = useState({});
    useEffect(()=>{
        axios.get(`http://localhost:3000/posts/${id}`)
        .then((response) => setPostData(response.data))
        .catch((error) => console.log(error));
    },[])
  return (
    <>
   <img
            src={`http://localhost:3000/${postData.imageUrl}`}
            alt={postData.image}
            style={{
              marginTop: "20px",
              width: "100%",
              height: "590px",
              objectFit: "contain",
            }}
          />
            <span style={{textAlign:"center",display:"block"}}>Image by {postData.title}</span>
            
    </>
  )
}

export default singlepage