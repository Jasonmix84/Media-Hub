import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './client';
import { Link, useNavigate } from 'react-router-dom';
import Post from './components/Post';

function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select()
        .order('created_at', { ascending: false });
      setPosts(data);
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    getSession();
    fetchPosts();
  }, []);

  // Function to sort posts by 'created_at' in descending order
  const sortByNewest = () => {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setPosts(sortedPosts);
  };

  // Function to sort posts by 'upvotes' in descending order
  const sortByPopularity = () => {
    const sortedPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    setPosts(sortedPosts);
  };

  return (
    <>
      <div className="App">
        {!loading && authenticated && (
          <div className="app-header">
            <button className="sign-out-btn" onClick={signOut}>Sign Out</button>
            <Link to={'/Create'} className="create-post-btn">
              Create A Post!
            </Link>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        {posts && posts.length > 0 ? (
          <div className="loaded-page">
            <div className="sort-options">
              <h4>Order by:</h4>
              <button onClick={sortByNewest}>Newest</button>
              <button onClick={sortByPopularity}>Most Popular</button>
            </div>

            <div className="Posts">
              {posts
                .filter((post) => {
                  if (searchTerm === "") {
                    return post;
                  } else if (
                    post.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return post;
                  }
                  return null;
                })
                .map((post) => (
                  <Post
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    created_at={post.created_at}
                    upvotes={post.upvotes}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div>
            <h2>{'No Posts Created Yet 😞'}</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default App;