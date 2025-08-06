import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../client'

function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch post and session data in parallel for efficiency
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select()
                .eq('id', id)
                .single();

            const { data: { session } } = await supabase.auth.getSession();

            if (postError) {
                console.error("Error fetching post: ", postError);
            } else {
                setPost(postData);
            }

            if (session) {
                setUserID(session.user.id);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

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

    /**
     * **FIXED & IMPROVED FUNCTION**
     * This function now handles cases where comments are null and updates the UI instantly.
     */
    const addComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return; // Don't add empty comments

        // Use post.comments if it's an array, otherwise start with an empty array
        const existingComments = post.comments || [];
        const updatedComments = [...existingComments, comment];

        // Update the database and get the updated post back
        const { data, error } = await supabase
            .from('posts')
            .update({ comments: updatedComments })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error adding comment: ", error);
        } else {
            // Update local state to re-render with the new comment, avoiding a page reload
            setPost(data);
            // Clear the comment input
            setComment("");
        }
    };

    return (
        <div className="post-details">
            {loading ? (
                <p>Loading...</p>
            ) : post ? (
                <>
                    {/* Show Edit link only if the logged-in user is the creator */}
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
                            <img src={post.imageURL} alt={`Image for ${post.title}`} />
                        </>
                    )}

                    <h5>{post.upvotes} Upvotes</h5>
                    <button onClick={upvotePost}>Upvote</button>

                    <div className="comments">
                        <h3>Comments</h3>
                        {/* Display comments if they exist and there are more than 0 */}
                        {post.comments && post.comments.length > 0 ? (
                             <ul>
                                {post.comments.map((c, index) => (
                                    <li key={index}>{c}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No Comments yet. Be the first!</p>
                        )}

                        <form onSubmit={addComment}>
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                required
                            />
                            <button type="submit">Add Comment</button>
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

export default PostDetails;