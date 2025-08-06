import { useState, useEffect } from 'react'
import { supabase } from '../client'
import './Create.css' // Import the new CSS file

const Create = () => {
    const [post, setPost] = useState({title: "", description: "", imageURL: "", tags: []})
    const [userID, setUserID] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session) {
                setUserID(session.user.id);
            }
            setLoading(false);
        }

      getSession();
    }, [])

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


    const createPost = async (event) => {
        event.preventDefault()

        await supabase
            .from('posts')
            .insert({title: post.title, description: post.description, imageURL: post.imageURL, upvotes: 0, tags: post.tags, creatorID: userID, comments: null})
            .select()
        window.location = "/"
    }

    return (
    <div className="Create">
        <h1>Create A New Post!</h1>
        {!loading &&
            <form className="create-form" onSubmit={createPost}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input id="title" onChange={handleChange} type="text" name="title" value={post.title} placeholder="Post Title" required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea id="description" onChange={handleChange} name="description" value={post.description} placeholder="Tell us more..."></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="imageURL">Image URL (Optional)</label>
                    <input id="imageURL" onChange={handleChange} type="text" name="imageURL" value={post.imageURL} placeholder="https://example.com/image.png" />
                    
                    
                </div>

                <div className="tags-container">
                    <div className="form-group"><label htmlFor="tags">Tags (OpTional)</label></div>
                    
                    <div className="tag-option">
                        <input id="tag-video-game" type="checkbox" name="tags" value="video-game" checked={post.tags.includes("video-game")} onChange={handleChange} />
                        <label htmlFor="tag-video-game">Video Game</label>
                    </div>
                    <div className="tag-option">
                        <input id="tag-movie" type="checkbox" name="tags" value="movie" checked={post.tags.includes("movie")} onChange={handleChange} />
                        <label htmlFor="tag-movie">Movie</label>
                    </div>
                    <div className="tag-option">
                        <input id="tag-show" type="checkbox" name="tags" value="show" checked={post.tags.includes("show")} onChange={handleChange} />
                        <label htmlFor="tag-show">Show</label>
                    </div>
                     <div className="tag-option">
                        <input id="tag-book" type="checkbox" name="tags" value="book" checked={post.tags.includes("book")} onChange={handleChange} />
                        <label htmlFor="tag-book">Book</label>
                    </div>
                     <div className="tag-option">
                        <input id="tag-social-media" type="checkbox" name="tags" value="social-media" checked={post.tags.includes("social-media")} onChange={handleChange} />
                        <label htmlFor="tag-social-media">Social Media</label>
                    </div>
                    <div className="tag-option">
                        <input id="tag-other" type="checkbox" name="tags" value="other" checked={post.tags.includes("other")} onChange={handleChange} />
                        <label htmlFor="tag-other">Other</label>
                    </div>
                </div>

                <button type="submit">Create Post</button>
            </form>
        }
    </div>
);
}

export default Create
