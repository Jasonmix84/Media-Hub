import { useState, useEffect } from 'react'
import { supabase } from '../client'
import './Create.css'

const Create = () => {
    const [post, setPost] = useState({title: "", description: "", imageURL: "", tags: []})
    const [userID, setUserID] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setUserID(session.user.id);
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
                <input onChange={handleChange} type="text" name="title" value={post.title} placeholder="Title" required /><br />
                <input onChange={handleChange} type="text" name="description" value={post.description} placeholder="Description (Optional)" /><br />
                <input onChange={handleChange} type="text" name="imageURL" value={post.imageURL} placeholder="Image URL (Optional)" /><br />

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

                <button type="submit">Create Post</button>
            </form>
        }
    </div>
);
}

export default Create