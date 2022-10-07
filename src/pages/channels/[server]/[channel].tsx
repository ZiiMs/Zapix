import Layout from '@/components/layout';
import { NextPageWithLayout } from '@/pages/_app';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query
  if(server ==='me') {
    return (<div>DMS!</div>)
  }

  return (
    <div>
      Channel:{channel}Server:{server}
    </div>
  );
};


const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

Channel.getLayout = getLayout;
export default Channel;
