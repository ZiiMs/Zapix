import Layout from '@/components/layout';
import { NextPageWithLayout } from '@/pages/_app';
import React, { ReactElement } from 'react';

const Me: NextPageWithLayout = () => {
  return <div>This is Me </div>;
};

const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

Me.getLayout = getLayout;
export default Me;


