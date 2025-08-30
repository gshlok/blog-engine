import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    }
    loadPosts();
  }, []);

  return (
    <div>
      <h1>My Blog Engine</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;   // ✅ this was missing
