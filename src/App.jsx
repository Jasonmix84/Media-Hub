import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './client'
import { Link, useNavigate } from 'react-router-dom'
import Post from './components/Post'

function App() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  }

  useEffect(() => {
      const fetchPosts = async () => {
        const {data} = await supabase
            .from('posts')
            .select()
            .order('created_at', { ascending: false })
            // set state of posts
            setPosts(data)
        }

        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setAuthenticated(!!session);
            setLoading(false);
        }

      getSession();
      fetchPosts();
  }, [])

  return (
    <>
      <div className="App">
        {!loading && authenticated &&
        <div>

        <button onClick={signOut}>Sign Out</button>
        <Link 
                  style={{ color: "White" }}
                  to={'/Create'}
              >
                  Create A Post!
        </Link>
        </div>
        }

        {posts && posts.length > 0 ?
        <div className="loaded-page">

        
            <div className="sort-options">
              <h4>Order by:</h4>
              <button>Newest</button>
              <button>Most Popular</button>
            </div>

            <div className="Posts">
            
              {posts.map((post,index) => 
                <Post
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  created_at={post.created_at}
                  upvotes={post.upvotes}
                />
              )}
            
            </div> 
          </div>
          :
          <div>
              <h2 >{'No Posts Created Yet 😞'}</h2>
              
          </div>
        }
        
      </div>
    </>
  )
}

export default App
