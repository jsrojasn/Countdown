# Countdown Timer Programming Exercise

The objective of this programming exercise is to build a shared countdown timer
that can be simultaneously experienced by multiple users. An example
implementation can be found [here](https://countdown.cadencework.com).

## Instructions

1. Make a clone of of this repository
2. Place the `config.json` file we provided you in the `src` directory
3. In the project root directory, run:

```
npm ci
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in multiple browser windows and try pressing the buttons to see how it works
5. The code in its current state does not implement the full functionality. You'll need to modify the existing code and write new code in order to make it work as expected.
6. When you're done, upload your repository to Github or another service of your choice and send us a link

## Requirements

- Clicking the **Reset** button should reset the timer to `3:00` minutes
- Clicking the **Start/Stop** button should unpause and pause the timer respectively
- The timer should count downward, updating every second until it reaches `0:00`
- Multiple users should be able to visit the site and all simultaneously see the same value
- Closing or reloading the browser should not impact the timer's behavior. On reload, the site should display the same content as if the page was never closed.
- Your implementation should avoid excessive writes to persistent storage. For example, **do not** update the database every second with the current time.

## Details

- The core functionality of the timer is in `src/components/timer.js` but feel free to reorganize the files as you see fit
- Areas where you should add code are marked with a `TODO` comment
- Application state is persisted using Google [Firestore](https://firebase.google.com/docs/firestore). Add additional fields to the persisted data object as needed. Calls to the Firestore API are wrapped via functions in `lib/firestore.js` so you don't need to be familiar with Firestore in order to complete the project, but links to documentation are provided in the comments.
