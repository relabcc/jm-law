import React from 'react';

import Container from 'components/Container';
import Link from 'components/Link';

import Layout from '../Layout'

const AboutPage = () => (
  <Layout>
    <Container>
      <h1>
        About
      </h1>
      <Link to="/">
        Back Home
      </Link>
    </Container>
  </Layout>
);

export default AboutPage;
