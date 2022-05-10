import {graphql, usePreloadedQuery, useLazyLoadQuery} from 'react-relay';

import BlogPosts from '../components/BlogPosts';
import Nav from '../components/Nav';
import {Content} from '../components/LayoutComponents';
import {getPreloadedQuery} from '../lib/relay/getServerSideProps';
import * as pagesIndexQuery from '../__generated__/pagesIndexQuery.graphql';
import type {pagesIndexQuery as PagesIndexQuery} from '../__generated__/pagesIndexQuery.graphql';
import {NextRelayPage} from '../lib/relay/sharedTypes';
import {GetServerSideProps} from 'next';

const query = graphql`
  query pagesIndexQuery @preloadable {
    viewer {
      ...BlogPosts_viewer
    }
  }
`;

const Index: NextRelayPage = ({queryRefs}) => {
  const {viewer} = usePreloadedQuery<PagesIndexQuery>(
    query,
    queryRefs.pagesIndexQuery,
  );
  return (
    <>
      <Nav />
      <Content>
        <BlogPosts viewer={viewer} />
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
        pagesIndexQuery: await getPreloadedQuery(
          pagesIndexQuery.default,
          {},
          baseUrl,
        ),
      },
    },
  };
};
