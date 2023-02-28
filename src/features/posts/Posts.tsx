import { useDispatch, useSelector } from "react-redux";
import { deletePost, getPosts, addPost, incrementReaction, fetchPosts, getPostsStatus, getPostsError } from "./postsSlice";
import { useEffect, useState } from "react";
import { setStatesValue } from "src/utils";
import { fetchUsers, getUsers, getUsersStatus } from "../users/usersSlice";
import "./posts.scss";
import classNames from "classnames";
import { Status } from "src/enums";
import axios from "axios";

export function Posts() {
  const dispatch = useDispatch();

  const posts = useSelector(getPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  const authors = useSelector(getUsers);
  const authorsStatus = useSelector(getUsersStatus);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [requestStatus, setRequestStatus] = useState(Status.idle);

  useEffect(() => {
    window.addEventListener('offline', () => {
      alert('you\'re offline!');
    });
  }, []);

  useEffect(() => {
    if (postsStatus === Status.idle) {
      dispatch(fetchPosts() as any);
    }
  }, [postsStatus, dispatch]);

  useEffect(() => {
    if (authorsStatus === Status.idle) {
      dispatch(fetchUsers() as any);
    }
  }, [authorsStatus, dispatch]);

  const canSave = ([authorId, title.trim(), content.trim()].every(Boolean) && requestStatus === Status.idle);

  const onAddPost = () => {
    if (canSave) {
      try {
        setRequestStatus(Status.loading);
        dispatch(addPost(authorId, title, content));
        setStatesValue([setTitle, setContent, setAuthorId], '');
      } catch (e) {
        console.log('error while adding post: ', e);
      } finally {
        setRequestStatus(Status.idle);
      }
    }
  }

  const onEditable = () => setIsEditable(!isEditable);

  const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  let template;

  if (postsStatus === Status.loading) {
    template = <p>Loading...</p>
  } else if (postsStatus === Status.succeeded) {
    template = sortedPosts.map(({ id: postId, userId, title, content, date, reactions }) => {
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
    })
  } else if (postsStatus === Status.failed) {
    template = <p>{postsError}</p>
  }

  // axios.post('http://localhost:4000/posts', {id: 1, title: 'adsd', userId: 0, content: 'asdadsadasdasdadad', "date": "2023-02-26T14:56:17.890Z",
  // "reactions": [
  //   {
  //     "id": 0,
  //     "name": "thumbsUp",
  //     "value": "👍",
  //     "count": 0
  //   },
  //   {
  //     "id": 1,
  //     "name": "wow",
  //     "value": "😮",
  //     "count": 0
  //   },
  //   {
  //     "id": 2,
  //     "name": "heart",
  //     "value": "❤️",
  //     "count": 0
  //   },
  //   {
  //     "id": 3,
  //     "name": "rocket",
  //     "value": "🚀",
  //     "count": 0
  //   },
  //   {
  //     "id": 4,
  //     "name": "coffee",
  //     "value": "☕",
  //     "count": 0
  //   }
  // ]})
  //   .then((resp) => console.log(resp));

  return (
    <div className="posts">
      <div className="posts__inputs">
        <select name="authors" value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
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
        <button onClick={onAddPost} disabled={!canSave}>Add post</button>
      </div>
      <ul className="posts__list">
        {template}
      </ul>
    </div>
  );
}
