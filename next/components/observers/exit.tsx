import { useCallback } from "react";
import { Observer } from "mobx-react";
import { IconButton } from "../components/icon";
import { exitRoom } from "../effects/exit";

import { StoreContext } from '../conference/contexts';
import { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, onValue } from '@firebase/database';

export function ExitOpener({ channelId }: { channelId: string }) {
  const context = useContext(StoreContext);

  const [myMemberId, setMyMemberId] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, `/${channelId}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setMyMemberId(context?.room?.member?.id ?? null); // デフォルト値を設定
    });

    console.log("kokoda firebase fired: " + myMemberId);

    return () => unsubscribe();
  }, [channelId, context?.room?.member?.id]);

  const onClickExitRoom = useCallback(() => exitRoom({ channelId, myMemberId }), [channelId, myMemberId]); //これにより、channel idもmymember idも最新の状態で渡せる
  return (
    <Observer>
      {() => <IconButton name="exit_to_app" onClick={onClickExitRoom} />}
    </Observer>
  );
}
