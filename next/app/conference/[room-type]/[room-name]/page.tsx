"use client";

import Bootstrap from "../../../../components/observers/bootstrap";
import Settings from "../../../../components/observers/settings";
import Notification from "../../../../components/observers/notification";
import { StatsOpener, Stats } from "../../../../components/observers/stats";
import { ExitOpener } from "../../../../components/observers/exit";
import PinnedStream from "../../../../components/observers/pinned-stream";
import LocalStream from "../../../../components/observers/local-stream";
import RemoteStreams from "../../../../components/observers/remote-streams";
import Layout from "./layout"; //app/conference/conponents/layout.tsx
import ErrorDetail from "../../../../components/components/error-detail";
import Main from "../../../../components/components/main";
// import LeftBottom from "../../../../components/components/left-bottom";
// import CenterTop from "../../../../components/components/center-top";
import RightMenu from "../../../../components/components/right-menu";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import Head from "next/head";
import debug from "debug";
import packageInfo from "../../../../package.json";

// import Card from "../../../../components/card-game/card";
import Cards from "../../../../components/card-game/cards";
import CardControlCenter from "../../../../components/card-game/card-control-center";

import FavButton from "../../../../components/card-game/fav-button";


import { initializeFirebaseApp } from "../../../../components/utils/firebase";


const log = debug("main");

const ConferencePage: React.FC<{ params: { "room-type": string; "room-name": string } }> = ({ params }) => {
    initializeFirebaseApp();

    const { "room-type": roomType, "room-name": roomName } = params;

    useEffect(() => {
        log(`${packageInfo.name} v${packageInfo.version}`);
        document.title += ` v${packageInfo.version}`;
    }, []);

    useEffect(() => {
        // ページが読み込まれたときに履歴スタックに状態を追加
        history.pushState(null, "", location.href);

        // 'popstate'イベントリスナーを追加
        window.addEventListener('popstate', handlePopState);

        return () => {
            // コンポーネントがアンマウントされるときにイベントリスナーを削除
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    function handlePopState(e: PopStateEvent) {
        // 戻る操作が行われたときに再度状態を上書き
        history.go(1);
    }

    function fallbackRender({ error }: { error: Error }) {
        return (
            <Layout>
                <ErrorDetail error={error} />
            </Layout>
        );
    }

    return (
        <Layout>
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
            <ErrorBoundary fallbackRender={fallbackRender}>
                <Bootstrap roomType={roomType} roomName={roomName}>
                    {/* Base Layer */}
                    <Main>
                        <PinnedStream />
                    </Main>
                    <Cards channelId={roomType + "_" + roomName} />
                    <div className="absolute top-4 left-4">
                        <FavButton channelId={roomType + "_" + roomName} />
                    </div>

                    <RightMenu
                        openers={[<StatsOpener key="stats" />, <ExitOpener key="exit" channelId={roomType + "_" + roomName} />]}
                    >
                        <RemoteStreams />
                        <LocalStream />

                        {/* <Favorite /> */}
                    </RightMenu>

                    {/* Modal Layer */}
                    <Settings />
                    <Stats />
                    <Notification />
                </Bootstrap>
            </ErrorBoundary>
        </Layout>
    );
};

export default ConferencePage;