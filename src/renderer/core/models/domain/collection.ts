import { CollectionData } from '../data/collectionData'

import { CollectionView } from '../view/collectionView'

import Domain from '../../../core/models/domain/domainBase'
import { EncString } from '../../../core/models/domain/encString'

export class Collection extends Domain {
  id: string
  organizationId: string
  name: EncString
  externalId: string
  readOnly: boolean
  hidePasswords: boolean
  revisionDate: Date

  constructor (obj?: CollectionData, alreadyEncrypted: boolean = false) {
    super()
    if (obj == null) {
      return
    }

    this.buildDomainModel(
      this,
      obj,
      {
        id: null,
        organizationId: null,
        name: null,
        externalId: null,
        readOnly: null,
        hidePasswords: null
      },
      alreadyEncrypted,
      ['id', 'organizationId', 'externalId', 'readOnly', 'hidePasswords']
    )
    this.revisionDate =
      obj.revisionDate != null ? new Date(obj.revisionDate) : null
  }

  decrypt (): Promise<CollectionView> {
    return this.decryptObj(
      new CollectionView(this),
      {
        name: null
      },
      this.organizationId
    )
  }
}
