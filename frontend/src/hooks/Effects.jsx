import { useState } from 'react';
import { useEffect } from 'react';

const Effect = () => {
    const [count,setCount]=useState(0)
    const [users,setUsers]=useState([])
    const [posts,setPosts]=useState([])
    useEffect(()=>{
         fetch('https://jsonplaceholder.typicode.com/users')
         .then((res)=>res.json())
         .then((data)=>setUsers(data))
        },[])
    useEffect(()=>{
         fetch('https://jsonplaceholder.typicode.com/posts')
         .then((res)=>res.json())
         .then((data)=>setPosts(data))
        },[])    
        console.log(posts)
        
    return(
        <div>
            <ul>
                {users.map((user)=>(
                   
                <li key={user.id}>{user.name}</li>
               ))}
            </ul>
            <ul>
                {posts.map((post)=>(
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Effect