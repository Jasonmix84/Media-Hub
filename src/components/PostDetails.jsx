import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../client'

function PostDetails(props) {
    const { id } = useParams();
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(null)
    const [userID, setUserID] = useState("")

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('posts')
                .select()
                .eq('id', id)
                .single()
            setPost(data)
            setLoading(false)
        }
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setUserID(session.user.id);
            setLoading(false);
        }

        getSession()
        fetchPost()
    }, [id])

    const upvotePost = async () => {
        if (!post) return;
        const { data, error } = await supabase
            .from('posts')
            .update({ upvotes: post.upvotes + 1 })
            .eq('id', id)
            .select()
            .single();
        if (!error && data) {
            setPost(data);
        }
    };


    return (
        <div className="post-details">
            {/* ...existing code... */}
            {loading ? (
                <p>Loading...</p>   
            ) : post ? (
                <>
                    {/* Show Edit link if user is creator */}
                    {post.creatorID === userID && (
                        <div style={{ textAlign: "right" }}>
                            <Link to={`/Edit/${post.id}`}>Edit</Link>
                        </div>
                    )}

                    <h5>Posted At: {new Date(post.created_at).toLocaleString()}</h5>
                    <h3>{post.title}</h3>

                    {post.description && (
                        <>
                        <h3>Description:</h3>
                        <p>{post.description}</p>
                        </>
                    )}

                    {post.imageURL && (
                        <>
                        <h3>Image:</h3>
                        <img src={`${post.imageURL}`}/>
                        </>
                    )}

                    <h5>{post.upvotes} Upvotes</h5>
                    <button onClick={upvotePost}>Upvote</button>

                    <div className="comments">
                        <h3>Comments</h3>
                        {post.comments ? (
                            <>
                            {post.comments.map((comment, index) => {
                                <ul>comment</ul>
                            })
                            }
                            </>
                        ) : (
                            <>
                            <p>No Comments So far</p>
                            </>
                        )}

                        <form>
                            
                        </form>
                    </div>
                </>
            ) : (
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    <p style={{ color: "red" }}>No Post found with ID: {id}</p>
                </div>
            )}
        </div>
    );
}

export default PostDetails