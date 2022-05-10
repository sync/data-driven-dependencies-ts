import {useFragment, graphql} from 'react-relay';
import {Link} from '../components/LayoutComponents';
import {FancyBlogPostPreview_post$key} from '../__generated__/FancyBlogPostPreview_post.graphql';

type FancyListItemProps = {children?: React.ReactNode};

function FancyListItem({children}: FancyListItemProps) {
  return <li className="shadow-xs rounded-md bg-gray-100 p-2">{children}</li>;
}

const FancyBlogPostPreview = ({
  post,
}: {
  post: FancyBlogPostPreview_post$key;
}) => {
  const data = useFragment(
    graphql`
      fragment FancyBlogPostPreview_post on FancyBlogPost {
        id
        title
        content
      }
    `,
    post,
  );

  return (
    <FancyListItem>
      <Link href={`/post/${data.id}`}>{data.title}</Link>
      <p>{data.content}</p>
    </FancyListItem>
  );
};

export default FancyBlogPostPreview;
