import { useSelector } from "react-redux"
import { getPosts, } from "./postsSlice"

export function Posts() {
  const posts = useSelector(getPosts);

  const isRenderPosts = !!posts?.length;

  const postsTemplate = isRenderPosts && posts.map(({ id, title, content }) => {
    return <li key={id}>
      {title}
      <br />
      {content}
    </li>
  })

  return (
    <div className="posts">
      <ul className="posts">
        {postsTemplate}
      </ul>
    </div>
  )
}