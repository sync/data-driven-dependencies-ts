import { Suspense } from 'react';
import { usePaginationFragment, graphql } from 'react-relay';
import { BlogPosts_viewer$key } from '../__generated__/BlogPosts_viewer.graphql';
import { Title, Button } from './LayoutComponents';
import RelayMatchContainer from './RelayMatchContainer';

export default function BlogPosts({
  viewer,
}: {
  viewer: BlogPosts_viewer$key | null;
}) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment BlogPosts_viewer on Viewer
      @refetchable(queryName: "BlogPostsPaginationQuery")
      @argumentDefinitions(
        after: { type: String }
        first: { type: Int, defaultValue: 2 }
      ) {
        allBlogPosts(
          after: $after
          first: $first
          orderBy: { createdAt: desc }
        ) @connection(key: "BlogPosts_allBlogPosts") {
          edges {
            node {
              __id
              ...BlogPostPreview_post @module(name: "BlogPostPreview")
              ...FancyBlogPostPreview_post @module(name: "FancyBlogPostPreview")
            }
          }
        }
      }
    `,
    viewer,
  );

  return (
    <div>
      <Title>Blog posts</Title>
      <div>
        <Suspense fallback={null}>
          <ul className="mb-10 space-y-5">
            {data?.allBlogPosts?.edges?.map((edge) => {
              const node = edge?.node;
              if (!node) {
                return null;
              }

              return <RelayMatchContainer key={node.__id} match={node} />;
            })}
          </ul>
        </Suspense>
        <LoadMore
          disabled={isLoadingNext || !hasNext}
          onClick={() => {
            loadNext(1);
          }}
        />
      </div>
    </div>
  );
}

type LoadMoreProps = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function LoadMore({ onClick, disabled }: LoadMoreProps) {
  return (
    <Button size="standard" onClick={onClick} disabled={disabled}>
      Load More
    </Button>
  );
}
