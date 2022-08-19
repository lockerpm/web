
import { Collection } from '../domain/collection'
import { ITreeNodeObject } from '../../../jslib/src/models/domain/treeNode'

import { CollectionGroupDetailsResponse } from '../response/collectionResponse'
import { View } from '../../../jslib/src/models/view'

export class CollectionView implements View, ITreeNodeObject {
  id: string = null;
  organizationId: string = null;
  name: string = null;
  externalId: string = null;
  readOnly: boolean = null;
  hidePasswords: boolean = null;
  revisionDate: Date = null;
  constructor (c?: Collection | CollectionGroupDetailsResponse) {
    if (!c) {
      return
    }

    this.id = c.id
    this.organizationId = c.organizationId
    this.externalId = c.externalId
    if (c instanceof Collection) {
      this.readOnly = c.readOnly
      this.hidePasswords = c.hidePasswords
    }
    this.revisionDate = typeof (c.revisionDate) === 'string' ? new Date(c.revisionDate) : c.revisionDate
  }
}
