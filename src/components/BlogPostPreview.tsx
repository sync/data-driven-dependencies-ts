import { useFragment, graphql } from 'react-relay';
import { BlogPostPreview_post$key } from '../__generated__/BlogPostPreview_post.graphql';
import { Link } from '../components/LayoutComponents';

const BlogPostPreview = ({ post }: { post: BlogPostPreview_post$key }) => {
  const data = useFragment(
    graphql`
      fragment BlogPostPreview_post on BlogPost {
        id
        title
      }
    `,
    post,
  );

  return (
    <li>
      <Link href={`/post/${data.id}`}>{data.title}</Link>
    </li>
  );
};

export default BlogPostPreview;
