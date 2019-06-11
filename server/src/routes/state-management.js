import { Machine } from 'xstate';

export const requestRecordMachine = Machine({
  id: 'requestRecord',
  context: {  },
  initial: 'draft',
  strict: true,
  states: {
    draft: {
      on: {
        SAVE: 'draft',
        FINALIZE: {
          target: 'finalized',
          actions: (context, event) => { console.log('activating...'); }
        }
      },
      exit: ['logAction'],
    },
    finalized: {
      on: {
        SAVE: 'underReview',
        ACCEPT: 'accepted'
      },
      exit: ['logAction'],
    },
    underReview: {
      on: {
        SAVE: 'underReview',
        FINALIZE: 'finalized'
      },
      exit: ['logAction'],
    },
    accepted: {
      on: { REMOVE: 'finalized'},
      exit: ['logAction'],
    },
  }
}, {
  actions: {
    logAction: (context, event) => {
      console.log('---------');
      console.log(context);
      console.log(event);
    },
  }
});
