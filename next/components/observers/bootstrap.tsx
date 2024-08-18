import { useContext, useEffect, ReactNode, Fragment } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../conference/contexts";
import {
  checkRoomSetting,
  initAudioDeviceAndClient,
  listenStoreChanges,
  listenGlobalEvents,
  // listenUserLeaveEvent,
} from "../effects/bootstrap";
import ErrorDetail from "../components/error-detail";
import Loader from "../components/loader";
import Notification from "./notification";

interface Props {
  children: ReactNode;
  roomType: string;
  roomName: string;
}

function Bootstrap({ children, roomType, roomName }: Props) {
  const store = useContext(StoreContext);

  useEffect(() => {
    checkRoomSetting(store, roomType, roomName);
    initAudioDeviceAndClient(store);
    listenStoreChanges(store);
    listenGlobalEvents(store);
    // listenUserLeaveEvent(store);
  }, [store, roomType, roomName]);

  const { ui, client, room, media } = store;
  return (
    <Observer>
      {() => {
        if (ui.error !== null) {
          return <ErrorDetail error={ui.error} />;
        }

        if (!(client.isReady && room.isReady && media.isAudioEnabled)) {
          return (
            <Fragment>
              {/* Base Layer */}
              <Loader />
              {/* Modal Layer */}
              <Notification />
            </Fragment>
          );
        }

        return <Fragment>{children}</Fragment>;
      }}
    </Observer>
  );
}

export default Bootstrap;
