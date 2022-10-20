import Layout from '@/components/layout';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import React, { ReactElement } from 'react';

const Me: NextPageWithLayout = () => {
  return <div>This is Me </div>;
};

const getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <Navbar />
      <LayoutWrapper>{page}</LayoutWrapper>
    </Layout>
  );
};

Me.getLayout = getLayout;
export default Me;

