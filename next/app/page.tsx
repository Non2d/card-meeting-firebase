// app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Head from 'next/head';
import debug from 'debug';
import packageInfo from '../package.json';
import { RoomInit } from '../components/index-utils/types';
import Layout from './layout';
import RoomCreate from '../components/index-component/room-create';

const log = debug('main');

const HomePage: React.FC = () => {
  const router = useRouter();

  const enterConference = (room: RoomInit) => {
    router.push(`/conference/${room.mode}/${room.id}`); //動的ルーティング
  };

  useEffect(() => {
    log(`${packageInfo.name} v${packageInfo.version}`);
    document.title += ` v${packageInfo.version}`;
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width" />
        <link href="/icon/favicon.ico" rel="shortcut icon" />
        <title>SkyWay Conference</title>
        <meta name="description" content="カードゲームで積極的な議論を促すWeb会議アプリケーション" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cardgame Meeting" />
        <meta property="og:description" content="カードゲームで積極的な議論を促すWeb会議アプリケーションです。" />
        <meta property="og:image" content="https://skyway.ntt.com/ogp.png" />
        <meta name="twitter:image" content="https://skyway.ntt.com/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SkyWayOfficial" />
      </Head>
      <Layout>
        <RoomCreate onSubmit={enterConference} />
      </Layout>
    </>
  );
}

export default HomePage;