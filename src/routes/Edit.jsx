import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Edit.css';
import { supabase } from '../client';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: "", description: "", imageURL: "", tags: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAndFetchPost = async () => {
            // Get the current user session
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch the post from the database
            const { data: postData, error } = await supabase
                .from('posts')
                .select()
                .eq('id', id)
                .single();

            // If there's no post or an error, handle it
            if (error || !postData) {
                console.error("Error fetching post or post not found");
                setLoading(false);
                navigate('/'); // Redirect home if post doesn't exist
                return;
            }

            // **THE IMPORTANT CHECK**
            // If the user is not logged in OR the user's ID does not match the post's creatorID
            if (!session || session.user.id !== postData.creatorID) {
                alert("You are not authorized to edit this post.");
                navigate(`/Post/${id}`); // Redirect to the post details page
            } else {
                setPost(postData);
                setLoading(false);
            }
        };

        checkUserAndFetchPost();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox" && name === "tags") {
            setPost(prev => {
                if (checked) {
                    return { ...prev, tags: [...prev.tags, value] };
                } else {
                    return { ...prev, tags: prev.tags.filter(tag => tag !== value) };
                }
            });
        } else {
            setPost(prev => ({ ...prev, [name]: value }));
        }
    };

    const updatePost = async (event) => {
        event.preventDefault();

        const { error } = await supabase
            .from('posts')
            .update({
                title: post.title,
                description: post.description,
                imageURL: post.imageURL,
                tags: post.tags
            })
            .eq('id', id);

        if (error) {
            console.error("Error updating post: ", error);
        } else {
            navigate(`/Post/${id}`);
        }
    };

    const deletePost = async (event) => {
        event.preventDefault();

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting post: ", error);
        } else {
            navigate('/');
        }
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Edit">
            <h1>Edit Post</h1>
            <form onSubmit={updatePost}>
                <input onChange={handleChange} type="text" name="title" value={post.title} placeholder="Title" required /><br />
                <input onChange={handleChange} type="text" name="description" value={post.description || ''} placeholder="Description (Optional)" /><br />
                <input onChange={handleChange} type="text" name="imageURL" value={post.imageURL || ''} placeholder="Image URL (Optional)" /><br />

                <label>
                    <input type="checkbox" name="tags" value="video-game" checked={post.tags.includes("video-game")} onChange={handleChange} />
                    Video Game
                </label><br />

                <label>
                    <input type="checkbox" name="tags" value="movie" checked={post.tags.includes("movie")} onChange={handleChange} />
                    Movie
                </label><br />

                <label>
                    <input type="checkbox" name="tags" value="show" checked={post.tags.includes("show")} onChange={handleChange} />
                    Show
                </label><br />

                <label>
                    <input type="checkbox" name="tags" value="book" checked={post.tags.includes("book")} onChange={handleChange} />
                    Book
                </label><br />

                <label>
                    <input type="checkbox" name="tags" value="social-media" checked={post.tags.includes("social-media")} onChange={handleChange} />
                    Social Media
                </label><br />

                <label>
                    <input type="checkbox" name="tags" value="other" checked={post.tags.includes("other")} onChange={handleChange} />
                    Other
                </label><br />

                <button type="submit">Update Post</button>
                <button className="delete-button" onClick={deletePost}>Delete Post</button>
            </form>
        </div>
    );
}

export default Edit;