import AppContext from "../AppContext";

import { useContext, useEffect, useState } from "react";

import config from "../config.json";
import { dbDocumentListen, dbDocumentSet } from "../lib/firestore";

const Timer = () => {
  const context = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const timerStartStop = async () => {
    dbDocumentSet(context, config.timer.docId, {
      isActive: !isActive,
      // TODO: Add additional data fields to store here
    });
  };

  const timerReset = async () => {
    dbDocumentSet(context, config.timer.docId, {
      isActive: false,
      // TODO: Add additional data fields to store here
    });
  };

  useEffect(() => {
    // Trigger callback whenever timer data changes
    const unsubscribe = dbDocumentListen(
      context,
      config.timer.docId,
      (data) => {
        setIsActive(data.isActive);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [context]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>This is timer {config.timer.docId}</div>
      <div>The timer is {isActive ? "active" : "inactive"}</div>

      {/* TODO: Make this a real countdown value */}
      <div>{"29:59"}</div>

      <button onClick={timerStartStop}>{!isActive ? "Start" : "Stop"}</button>
      <button onClick={timerReset}>Reset</button>
    </div>
  );
};

export default Timer;
