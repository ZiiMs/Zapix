import Layout from '@/components/layout';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar, { Types } from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query;

  return (
    <div>
      Channel:{channel}Server:{server}
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <Navbar type={Types.Channels} />
      <LayoutWrapper>{page}</LayoutWrapper>
    </Layout>
  );
};

Channel.getLayout = getLayout;
export default Channel;

