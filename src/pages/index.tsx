import { GetServerSideProps } from 'next';
import { graphql, usePreloadedQuery } from 'react-relay';

import * as pagesIndexQuery from '../__generated__/pagesIndexQuery.graphql';
import type { pagesIndexQuery as PagesIndexQuery } from '../__generated__/pagesIndexQuery.graphql';
import BlogPosts from '../components/BlogPosts';
import { Content } from '../components/LayoutComponents';
import Nav from '../components/Nav';
import { getPreloadedQuery } from '../lib/relay/getServerSideProps';
import { NextRelayPage } from '../lib/relay/sharedTypes';

const query = graphql`
  query pagesIndexQuery @preloadable {
    viewer {
      ...BlogPosts_viewer
    }
  }
`;

const Index: NextRelayPage = ({ queryRefs }) => {
  const { viewer } = usePreloadedQuery<PagesIndexQuery>(
    query,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-argument
    queryRefs.pagesIndexQuery!,
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
