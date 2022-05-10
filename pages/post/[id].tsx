import {graphql, usePreloadedQuery, useLazyLoadQuery} from 'react-relay';
import BlogPost from '../../components/BlogPost';
import {Content} from '../../components/LayoutComponents';
import Nav from '../../components/Nav';
import {getPreloadedQuery} from '../../lib/relay/getServerSideProps';
import {NextRelayPage} from '../../lib/relay/sharedTypes';
import * as idPostPageQuery from '../../__generated__/IdPostPageQuery.graphql';
import type {IdPostPageQuery} from '../../__generated__/IdPostPageQuery.graphql';

// TODO: think about relay's query naming conventions
const query = graphql`
  query IdPostPageQuery($id: ID!) @preloadable {
    blogPost(id: $id) {
      ...BlogPost_post
    }
  }
`;

const Index: NextRelayPage = ({queryRefs}) => {
  const {blogPost} = usePreloadedQuery<IdPostPageQuery>(query, queryRefs.query);
  return (
    <>
      <Nav />
      <Content>
        {blogPost ? <BlogPost post={blogPost} /> : <p>Post not found.</p>}
      </Content>
    </>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        query: await getPreloadedQuery(idPostPageQuery.default, {
          id: ctx.query.id,
        }),
      },
    },
  };
}
