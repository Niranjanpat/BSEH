// backgroundActions.js

import BackgroundService from 'react-native-background-actions';
import { trySync } from './sync';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const backgroundSyncTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;

  console.log('[BackgroundActions] Background sync started.');

  while (BackgroundService.isRunning()) {
    try {
      await trySync();
    } catch (err) {
      console.error('[BackgroundActions] Sync failed:', err);
    }

    await sleep(delay);
  }

  console.log('[BackgroundActions] Background sync stopped.');
};

const options = {
  taskName: 'BackgroundSync',
  taskTitle: 'Sync in Background',
  taskDesc: 'App is syncing data...',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000 * 60 * 15, // 15 minutes
  },
};

// Start background task
export const startBackgroundSync = async () => {
  if (!BackgroundService.isRunning()) {
    await BackgroundService.start(backgroundSyncTask, options);
    console.log('[BackgroundActions] Background service started.');
  }
};

// Stop background task
export const stopBackgroundSync = async () => {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
    console.log('[BackgroundActions] Background service stopped.');
  }
};


//React Native Background Fetch

// import BackgroundFetch from 'react-native-background-fetch';
// import { trySync } from './sync';

// const backgroundSyncTask = async () => {
//   console.log('[BackgroundFetch] Background sync triggered');

//   try {
//     await trySync();
//     console.log('[BackgroundFetch] Sync success');
//   } catch (err) {
//     console.error('[BackgroundFetch] Sync failed:', err);
//   }

//   // Required: tell OS the task is done
//   BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
// };

// // Start background fetch
// export const startBackgroundSync = async () => {
//   const status = await BackgroundFetch.configure(
//     {
//       minimumFetchInterval: 15, // 15 minutes
//       stopOnTerminate: false,
//       enableHeadless: true,
//       startOnBoot: true,
//       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
//     },
//     backgroundSyncTask,
//     (error) => {
//       console.error('[BackgroundFetch] failed to start:', error);
//     }
//   );

//   console.log('[BackgroundFetch] started with status:', status);
// };

// // Stop background fetch
// export const stopBackgroundSync = async () => {
//   await BackgroundFetch.stop();
//   console.log('[BackgroundFetch] stopped');
// };