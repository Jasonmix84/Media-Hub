import { Link } from "react-router-dom";
import "./Post.css";

const Post = ({ id, title, created_at, upvotes}) => {
    return (
        <div className="post-preview">
        <Link to={`/Post/${id}`} className="post-link">
            <div className="post-details">
                <h5>Posted At: {new Date(created_at).toLocaleString()}</h5>
                <h3>{title}</h3>
                <h5>{upvotes} Upvotes</h5>
            </div>
        </Link>

        </div>
    )
}

export default Post