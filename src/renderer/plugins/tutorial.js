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

export default async ({ store, i18n }, inject) => {
  // Add new
  tour.addStep({
    id: 'add-pw-1',
    title: () => i18n.t('tutorial.step1.title'),
    text: () => i18n.t('tutorial.step1.text'),
    buttons: [
      {
        text: () => i18n.t('common.skip'),
        action: () => {
          tour.hide()
          tour.show('view-shares')
        },
        secondary: true
      }
    ],
    attachTo: {
      element: () => document.querySelector('#vault__add-btn'),
      on: 'auto'
    },
    modalOverlayOpeningPadding: 10,
    modalOverlayOpeningRadius: 30,
    popperOptions: {
      modifiers: [{ name: 'offset', options: { offset: [0, 22] } }]
    },
    advanceOn: {
      selector: '#vault__add-btn',
      event: 'click'
    }
  })

  // Add new password
  tour.addStep({
    id: 'add-pw-2',
    title: () => i18n.t('tutorial.step2.title'),
    text: () => i18n.t('tutorial.step2.text'),
    buttons: [
      {
        text: () => i18n.t('common.skip'),
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
    id: 'add-pw-3',
    title: () => i18n.t('tutorial.step3.title'),
    text: () => i18n.t('tutorial.step3.text'),
    useModalOverlay: false,
    buttons: [
      {
        text: () => i18n.t('common.skip'),
        action: () => {
          store.commit('UPDATE_UI', { closeAllModal: true })
          setTimeout(() => {
            store.commit('UPDATE_UI', { closeAllModal: false })
          }, 0)

          // Already called in dialog onClose
          // tour.hide()
          // tour.show('view-shares')
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
    title: () => i18n.t('tutorial.step4.title'),
    text: () => i18n.t('tutorial.step4.text'),
    buttons: [
      {
        text: () => i18n.t('common.skip'),
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
    title: () => i18n.t('tutorial.step5.title'),
    text: () => i18n.t('tutorial.step5.text'),
    buttons: [
      {
        text: () => i18n.t('common.skip'),
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
    title: () => i18n.t('tutorial.step6.title'),
    text: () => i18n.t('tutorial.step6.text'),
    buttons: [
      {
        text: () => i18n.t('common.skip'),
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
    modalOverlayOpeningPadding: 10,
    modalOverlayOpeningRadius: 30,
    popperOptions: {
      modifiers: [{ name: 'offset', options: { offset: [0, 22] } }]
    }
    // advanceOn: {
    //   selector: '#nav__profile',
    //   event: 'click'
    // }
  })

  Shepherd.on('cancel', () => {
    store.commit('UPDATE_UI', { isTutorialActive: false })
  })

  Shepherd.on('start', () => {
    store.commit('UPDATE_UI', { isTutorialActive: true })
  })

  inject('tutorial', tour)
}
