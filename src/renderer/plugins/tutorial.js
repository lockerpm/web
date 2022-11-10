import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    useModalOverlay: true,
    scrollTo: true,
    keyboardNavigation: false,
    popperOptions: {
      modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
    }
  }
})

export default async ({ store }, inject) => {
  const language = store.state.i18n.locale
  console.log(language)

  // Add new
  tour.addStep({
    title: '1. Add a new password',
    text: 'You can add new items like passwords, credit cards, secret notes, and more. Click on this button',
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.hide()
          tour.show('view-shares')
        },
        secondary: true
      }
    ],
    attachTo: {
      element: '#vault__add-btn',
      on: 'auto'
    },
    advanceOn: {
      selector: '#vault__add-btn',
      event: 'click'
    }
  })

  // Add new password
  tour.addStep({
    title: '1. Add a new password',
    text: 'Select <strong>Password</strong>',
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.hide()
          tour.show('view-shares')
        },
        secondary: true
      }
    ],
    attachTo: {
      element: '#vault__add-btn__Login',
      on: 'right'
    },
    advanceOn: {
      selector: '#vault__add-btn__Login',
      event: 'click'
    }
  })

  // Edit password and create
  tour.addStep({
    title: '2. Fill in and click save',
    text: 'Fill in needed information for your first item then click <strong>Save</strong><br>Fields with * are required',
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.hide()
          tour.show('view-shares')
        },
        secondary: true
      }
    ],
    attachTo: {
      element: () => document.querySelectorAll('#add-edit-cipher-dialog > div')[1],
      on: 'right'
    }
  })

  // View shares
  tour.addStep({
    id: 'view-shares',
    title: '3. Browse items & security',
    text: 'These are your sidebar menu. You can browse items faster with categories. You can also check your vault <strong>Security</strong> and <strong>Share</strong> items with other Locker users. Let’s take a look!',
    buttons: [
      {
        text: 'Skip',
        action: tour.next,
        secondary: true
      }
    ],
    attachTo: {
      element: '#sidebar__shares',
      on: 'right'
    },
    advanceOn: {
      selector: '#sidebar__shares',
      event: 'click'
    }
  })

  // View settings
  tour.addStep({
    title: '4. Sidebar menu options',
    text: 'These are your settings menu. You can see your security status Locker settings here. <br> Continue by clicking <strong>Settings</strong>.',
    buttons: [
      {
        text: 'Skip',
        action: tour.next,
        secondary: true
      }
    ],
    attachTo: {
      element: '#sidebar__settings',
      on: 'right'
    },
    advanceOn: {
      selector: '#sidebar__settings',
      event: 'click'
    }
  })

  // View profile
  tour.addStep({
    title: '5. Profile & options',
    text: 'Click on your Profile name to see options for your Locker account.<br> You can also find <strong>This tutorial</strong> in the options.',
    buttons: [
      {
        text: 'Next',
        action: () => {
          tour.cancel()
          store.commit('UPDATE_NOTICE', { showTutorialStep6: true })
        },
        secondary: true
      }
    ],
    attachTo: {
      element: '#nav__profile',
      on: 'bottom'
    },
    canClickTarget: false
    // advanceOn: {
    //   selector: '#nav__profile',
    //   event: 'click'
    // }
  })

  inject('tutorial', tour)
}
