import { createSitemapForPremiumByChannel } from 'utilities/sitemap';
import { GetServerSideProps } from 'next/types';
import { captureException, flush } from '@sentry/nextjs';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  try {
    const { host } = req.headers;
    if (!host) {
      throw 'host missing';
    }
    const { channelName } = query;
    const response = await createSitemapForPremiumByChannel(
      host,
      channelName as string
    );
    res.setHeader('Content-Type', 'application/xml');
    res.write(response);
    res.end();
  } catch (error) {
    captureException(error);
    await flush(2000);
    console.error(error);
    res.statusCode = 500;
    res.write('Something went wrong');
    res.end();
  }
  return { props: {} };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => null;
