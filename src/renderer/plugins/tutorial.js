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
    title: () => i18n.t('tutorial.step3.title'),
    text: () => i18n.t('tutorial.step3.text'),
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
        text: () => i18n.t('common.next'),
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
