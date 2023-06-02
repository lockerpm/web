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

export default async ({ store, i18n, $axios, redirect }, inject) => {
  // ---------------- ACTIONS ----------------

  const _closeModals = () => {
    store.commit('UPDATE_UI', { closeAllModal: true })
    setTimeout(() => {
      store.commit('UPDATE_UI', { closeAllModal: false })
    }, 0)
  }

  const _skip = () => {
    $axios.$put('/cystack_platform/pm/users/me/onboarding_process', {
      tutorial: true
    })
    store.commit('UPDATE_TUTORIAL', { isActive: false })
  }

  const _startFromAddPw = () => {
    tour.hide()
    store.commit('UPDATE_TUTORIAL', { currentStepId: 'add-pw-1' })
    _closeModals()
    redirect(302, `${store.state.i18n.locale === 'vi' ? '/vi' : ''}/vault`)
    setTimeout(() => {
      store.commit('UPDATE_TUTORIAL', { isActive: true })
      tour.show('add-pw-1')
    }, 1000)
  }

  const _startFromImport = () => {
    tour.hide()
    store.commit('UPDATE_TUTORIAL', { currentStepId: 'import-1' })
    redirect(
      302,
      `${store.state.i18n.locale === 'vi' ? '/vi' : ''}/settings/import-export`
    )
    setTimeout(() => {
      store.commit('UPDATE_TUTORIAL', { isActive: true })
      tour.show('import-1')
    }, 1000)
  }

  // const _markDone = stepId => {
  //   const progress = [...store.state.tutorial.doneSteps, stepId]
  //   store.commit('UPDATE_TUTORIAL', {
  //     doneSteps: progress
  //   })
  //   $axios.$put('/cystack_platform/pm/users/me/onboarding_process', {
  //     tutorial_process: progress
  //   })
  // }

  // ---------------- BUTTONS ----------------

  const BACK_BTN = {
    text: '<i class="el-icon-arrow-left"></i>',
    classes: 'tutorial-arrow',
    secondary: true
  }
  const NEXT_BTN = {
    text: '<i class="el-icon-arrow-right"></i>',
    classes: 'tutorial-arrow',
    secondary: true
  }
  const SKIP_BTN = {
    text: () => i18n.t('common.skip'),
    classes: 'tutorial-skip',
    secondary: true,
    action: () => {
      _skip()
      tour.hide()
    }
  }

  // ---------------- STEPS ----------------

  // Add new
  tour.addStep({
    id: 'add-pw-1',
    title: () => i18n.t('tutorial.tour.steps.add_pw.detail.step1.title'),
    text: () => i18n.t('tutorial.tour.steps.add_pw.detail.step1.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.hide()
          store.commit('UPDATE_NOTICE', { showTutorial: true })
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          _startFromImport()
        }
      },
      SKIP_BTN
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
    title: () => i18n.t('tutorial.tour.steps.add_pw.detail.step2.title'),
    text: () => i18n.t('tutorial.tour.steps.add_pw.detail.step2.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.back()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          _startFromImport()
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: '#vault__add-btn__1',
      on: 'right'
    },
    advanceOn: {
      selector: '#vault__add-btn__1',
      event: 'click'
    }
  })

  // Edit password and create
  tour.addStep({
    id: 'add-pw-3',
    title: () => i18n.t('tutorial.tour.steps.add_pw.detail.step3.title'),
    text: () => i18n.t('tutorial.tour.steps.add_pw.detail.step3.text'),
    useModalOverlay: false,
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          _startFromAddPw()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          _closeModals()
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: () =>
        document.querySelectorAll('#add-edit-cipher-dialog > div')[0],
      on: 'right'
    }
  })

  // Import file - click on select format
  tour.addStep({
    id: 'import-1',
    title: () => i18n.t('tutorial.tour.steps.import_file.detail.step1.title'),
    text: () => i18n.t('tutorial.tour.steps.import_file.detail.step1.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          _startFromAddPw()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          tour.show('view-security')
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: () =>
        document.querySelector('#import-format-select > div.el-select'),
      on: 'auto'
    },
    modalOverlayOpeningPadding: 10,
    modalOverlayOpeningRadius: 30,
    popperOptions: {
      modifiers: [{ name: 'offset', options: { offset: [0, 22] } }]
    },
    advanceOn: {
      selector: '#import-format-select > div.el-select',
      event: 'click'
    }
  })

  // Import file - select format
  tour.addStep({
    id: 'import-2',
    title: () => i18n.t('tutorial.tour.steps.import_file.detail.step2.title'),
    text: () => i18n.t('tutorial.tour.steps.import_file.detail.step2.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.back()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          tour.show('view-security')
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: () =>
        document.querySelector(
          'body > div.el-select-dropdown.el-popper.import-dropdown'
        ),
      on: 'top'
    }
    // Advance on select dropdown closed
  })

  // Import file - select file
  tour.addStep({
    id: 'import-3',
    title: () => i18n.t('tutorial.tour.steps.import_file.detail.step3.title'),
    text: () => i18n.t('tutorial.tour.steps.import_file.detail.step3.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.hide()
          tour.show('import-1')
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          tour.show('view-security')
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: () => document.querySelector('#import-file-select'),
      on: 'auto'
    },
    advanceOn: {
      selector: '#import-file-select',
      event: 'click'
    }
  })

  // Import file - import
  tour.addStep({
    id: 'import-4',
    title: () => i18n.t('tutorial.tour.steps.import_file.detail.step4.title'),
    text: () => i18n.t('tutorial.tour.steps.import_file.detail.step4.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.back()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          tour.show('view-security')
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: () => document.querySelector('#import-confirm'),
      on: 'auto'
    },
    advanceOn: {
      selector: '#import-confirm',
      event: 'click'
    }
  })

  // View security
  tour.addStep({
    id: 'view-security',
    title: () => i18n.t('tutorial.tour.steps.browse_items.detail.step1.title'),
    text: () => i18n.t('tutorial.tour.steps.browse_items.detail.step1.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          _startFromAddPw()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          tour.show('view-settings')
        }
      },
      SKIP_BTN
    ],
    attachTo: {
      element: '#sidebar__security_tools',
      on: 'right'
    },
    advanceOn: {
      selector: '#sidebar__security_tools',
      event: 'click'
    }
  })

  // View shares
  tour.addStep({
    id: 'view-shares',
    title: () => i18n.t('tutorial.tour.steps.browse_items.detail.step2.title'),
    text: () => i18n.t('tutorial.tour.steps.browse_items.detail.step2.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.back()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.next()
        }
      },
      SKIP_BTN
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
    id: 'view-settings',
    title: () => i18n.t('tutorial.tour.steps.view_settings.detail.step1.title'),
    text: () => i18n.t('tutorial.tour.steps.view_settings.detail.step1.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.hide()
          tour.show('view-security')
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.next()
        }
      },
      SKIP_BTN
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
    id: 'view-profile',
    title: () => i18n.t('tutorial.tour.steps.view_profile.detail.step1.title'),
    text: () => i18n.t('tutorial.tour.steps.view_profile.detail.step1.text'),
    buttons: [
      {
        ...BACK_BTN,
        action: () => {
          tour.back()
        }
      },
      {
        ...NEXT_BTN,
        action: () => {
          tour.hide()
          store.commit('UPDATE_NOTICE', { showTutorialStep6: true })
        }
      },
      SKIP_BTN
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

  // ---------------- EVENTS ----------------

  Shepherd.on('cancel', () => {
    store.commit('UPDATE_TUTORIAL', { isActive: false })
  })

  Shepherd.on('start', () => {
    store.commit('UPDATE_TUTORIAL', { isActive: true })
  })

  Shepherd.on('show', e => {
    store.commit('UPDATE_TUTORIAL', {
      currentStepId: e.step.id,
      isActive: true
    })
  })

  inject('tutorial', tour)
}
