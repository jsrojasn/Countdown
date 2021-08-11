import { useCallback, useContext, useEffect, useRef, useState } from "react";

import AppContext from "../AppContext";
import config from "../config.json";
import { dbDocumentListen, dbDocumentSet } from "../lib/firestore";

const Timer = () => {
  const context = useContext(AppContext);
  
  const countDownRef = useRef(undefined); // It will store the id of the interval function
  const secondsRef = useRef(180); // It will store teh number of seconds without re rendering 

  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [formattedTime, setFormattedTime] = useState(""); // It will store the rendered string with minutes and seconds


  const timerStartStop = async () => {
    if (isActive) {
      // Countdown is stopped, it is only required the number of seconds for the next start of itself
      dbDocumentSet(context, config.timer.docId, {
        isActive: false,
        seconds:  secondsRef.current,
      });
    } else {
      // Countdown is started, it is also required the endtime (see useEffect logic) 
      dbDocumentSet(context, config.timer.docId, {
        isActive: true,
        seconds:  secondsRef.current,
        endTime: new Date().getTime() + secondsRef.current * 1000,
      });
    }
  };

  const timerReset = async () => {
    dbDocumentSet(context, config.timer.docId, {
      isActive: false,
      seconds: 180,
    });
  };

  const formatMinutesAndSeconds = useCallback(()=>{
    // 1. Get The number of minutes and seconds that will be render based on the number of seconds left (secondsRef).
    // 2. Set the string "00:00" in case the number of seconds is negative and also add the padding left of zeros to both. 
    const minutesCount = Math.floor(secondsRef.current / 60) % 60;
    const secondsCount = Math.floor(secondsRef.current % 60);
    setFormattedTime(secondsRef.current > 0  ? `${ minutesCount >= 10 ? minutesCount : "0" + minutesCount}:${secondsCount >= 10 ? secondsCount: "0" + secondsCount}` : "00:00");
  }, [])

  const startCountDown = useCallback(() => {
    // 1. Format and render the current state of the timer
    // 2. Every second decrease in one the number of seconds left and render the formatted string with minutes and seconds
    formatMinutesAndSeconds();
    countDownRef.current = setInterval(() => {
      secondsRef.current -= 1;
      formatMinutesAndSeconds();
    }, 1000);
  }, [formatMinutesAndSeconds]);

  const stopCountDown = useCallback(() => {
    // 1. Format and render the current state of the timer.
    // 2. Clear the interval so the countdown is stopped.
    formatMinutesAndSeconds();
    clearInterval(countDownRef.current);
  }, [formatMinutesAndSeconds]);


  useEffect(() => {
    const unsubscribe = dbDocumentListen(
      context,
      config.timer.docId,
      (data) => {
        if (data.isActive) {
          // 1. The timer is active so the the seconds has to be calculated with the difference of the predicted end time persisted (remaining time).
          // 2. start countdown that will do the logic every second and set the component state isActive to true.
          if( data.endTime ) {
            secondsRef.current = Math.floor((data.endTime -  new Date().getTime()) / 1000);
          }
          startCountDown();
          setIsActive(true)
        } else  {
          // 1. The timer is inactive so the the seconds has to be number persisted when it was stopped.
          // 2. stop countdown fucntionality every second and set the component state isActive to false.
          if ( data.seconds ) {
            secondsRef.current = data.seconds;
          }
          stopCountDown();
          setIsActive(false)
        }
        // 1. States are set, set the isLoading to false so the countdown is rendered.
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [context, startCountDown, stopCountDown]);

  if (isLoading) {
    return <div className="timer-container">Loading...</div>;
  }

  return (
    <div className="timer-container">
      <div style={{ fontSize: "0.8em", paddingBottom: "15px" }}>
        <div>This is timer {config.timer.docId}</div>
        <div>The timer is {isActive ? "active" : "inactive"}</div>
      </div>

      <div className="timer">
        <div className="countdown">{formattedTime}</div>  
        <div style={{ textAlign: "center", paddingTop: "1em" }}>
          <button className="button" onClick={timerStartStop}>
            {!isActive ? "Start" : "Stop"}
          </button>
          <button className="button" onClick={timerReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
