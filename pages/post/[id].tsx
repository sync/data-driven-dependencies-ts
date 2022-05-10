import {GetServerSideProps} from 'next';
import {graphql, usePreloadedQuery} from 'react-relay';
import * as idPostPageQuery from '../../__generated__/IdPostPageQuery.graphql';
import type {IdPostPageQuery} from '../../__generated__/IdPostPageQuery.graphql';
import BlogPost from '../../components/BlogPost';
import {Content} from '../../components/LayoutComponents';
import Nav from '../../components/Nav';
import {getPreloadedQuery} from '../../lib/relay/getServerSideProps';
import {NextRelayPage} from '../../lib/relay/sharedTypes';

// TODO: think about relay's query naming conventions
const query = graphql`
  query IdPostPageQuery($id: ID!) @preloadable {
    blogPost(id: $id) {
      ...BlogPost_post
    }
  }
`;

const Index: NextRelayPage = ({queryRefs}) => {
  const {blogPost} = usePreloadedQuery<IdPostPageQuery>(
    query,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-argument
    queryRefs.query!,
  );
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host;

  const baseUrl = ` ${host?.includes('localhost') ? 'http' : 'https'}://${
    host ?? 'localhost:3000'
  }`;
  return {
    props: {
      preloadedQueries: {
        query: await getPreloadedQuery(
          idPostPageQuery.default,
          {
            id: context.query.id,
          },
          baseUrl,
        ),
      },
    },
  };
};
