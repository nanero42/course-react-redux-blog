import { useDispatch, useSelector } from "react-redux";
import { deletePost, getPosts, addPost, incrementReaction } from "./postsSlice";
import { useState } from "react";
import { setStatesValue } from "src/utils";
import { getUsers } from "../users/usersSlice";
import "./posts.scss";
import classNames from "classnames";

export function Posts() {
  const dispatch = useDispatch();

  const posts = useSelector(getPosts);
  const authors = useSelector(getUsers);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const canSave = !((authorId && title && content).trim());

  const onAddPost = () => {
    if ((title && content).trim()) {
      dispatch(addPost(authorId, title, content));
    }
    setStatesValue([setTitle, setContent, setAuthorId], '');
  }

  const onEditable = () => setIsEditable(!isEditable);

  const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="posts">
      <div className="posts__inputs">
        <select name="authors" onChange={(e) => setAuthorId(e.target.value)}>
          <option value="">Select author</option>
          {authors.map(({ id, name }) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
        <div>
          <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <input type="text" placeholder="content" value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
        <button onClick={onAddPost} disabled={canSave}>Add post</button>
      </div>
      <ul className="posts__list">
        {sortedPosts.map(({ id: postId, userId, title, content, date, reactions }) => {
            return (
              <li key={postId}>
                <div>
                  {authors.find((a) => a.id === userId ? a.name : null)?.name || 'Unknown user'}
                </div>
                <div>{date}</div>
                <input className={classNames('posts__input', {'posts__input-editable': isEditable})} type="text" value={title} disabled={!isEditable}/>
                <input className={classNames('posts__input', {'posts__input-editable': isEditable})} type="text" value={content} disabled={!isEditable}/>
                <button onClick={onEditable}>{isEditable ? 'cancel' : 'patch'}</button>
                {isEditable && <button>Save</button>}
                <button onClick={() => dispatch(deletePost(postId))}>delete</button>
                {reactions.map(({ id, name, value, count }) => {
                  return <div key={id} onClick={() => dispatch(incrementReaction({ postId: postId, reactionId: id}))}>
                    <button>{value}</button>
                    <span>{count}</span>
                  </div>
                })}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
