<template>
  <div
    v-loading="loading"
    class="flex flex-col flex-column-fluid relative"
  >
    <!-- Navigation Menu -->
    <div v-if="['vault', 'passwords', 'notes', 'identities', 'cards', 'crypto-backups'].includes(getRouteBaseName())" class="navigation-bar">
      <nuxt-link
        v-for="(item, index) in menuVault"
        :key="index"
        :to="localeRoute({name: item.routeName})"
        active-class="navigation-item__active"
        class="navigation-item"
        exact
      >
        {{ $t(`sidebar.${item.label}`) }}
      </nuxt-link>
    </div>
    <!-- Navigation Menu end -->

    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex justify-between">
          <div class="flex items-center">
            <!-- Breadcrumb -->
            <div class="text-head-4">
              <template v-if="getRouteBaseName() === 'vault-folders-folderId'">
                <nuxt-link
                  class="font-medium hover:no-underline"
                  :to="localeRoute({name: 'vault'})"
                >
                  {{ $t('sidebar.vault') }}
                </nuxt-link>
                <span class="font-medium">
                  &nbsp; / &nbsp; {{ folder.name || collection.name }}
                </span>
              </template>
              <template v-else-if="getRouteBaseName() === 'vault-teams-teamId-tfolders-tfolderId'">
                <nuxt-link
                  class="font-medium hover:no-underline"
                  :to="localeRoute({name: 'vault'})"
                >
                  {{ $t('sidebar.vault') }}
                </nuxt-link>
                <span class="font-medium">
                  &nbsp; / &nbsp; {{ getTeam(teams, $route.params.teamId).name }} - {{ collection.name }}
                </span>
              </template>
              <template v-else-if="getRouteBaseName() ==='vault'">
                <span class="font-medium">{{ $t('common.all_items') }}</span>
              </template>
              <template v-else-if="getRouteBaseName() ==='shares'">
                <span class="font-medium">{{ $t('sidebar.shared_with_you') }}</span>
              </template>
              <template v-else-if="getRouteBaseName() ==='trash'">
                <span class="font-medium">Trash</span>
              </template>
              <template v-else-if="getRouteBaseName() ==='shares-your-shares'">
                <span class="font-medium">{{ $t('type.your_shares') }}</span>
              </template>
              <template v-else-if="getRouteBaseName() ==='shares-requests'">
                <span class="font-medium">{{ $t('type.requests') }}</span>
              </template>
              <template v-else>
                <span class="font-medium">
                  {{ $tc(`type.${type}`, 2) }}
                </span>
              </template>
            </div>
            <!-- Breadcrumb end -->

            <!-- Add new button -->
            <template v-if="canAddItem">
              <div class="mx-6 text-head-4"> | </div>
              <div class="self-center">
                <el-dropdown
                  v-if="routeName==='vault'"
                  trigger="click"
                >
                  <button id="vault__add-btn" class="btn btn-outline-primary">
                    <i class="el-icon-plus text-lg" />
                    <span class="ml-3 break-all">{{ $t('common.add_new') }}</span>
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in options"
                      :key="item.value"
                      :value="item.value"
                      class="flex items-center justify-between"
                      @click.native="confirmDialog(item.value)"
                    >
                      <span :id="`vault__add-btn__${item.value}`">
                        {{ item.label }}
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <template v-else>
                  <button
                    class="btn btn-outline-primary"
                    @click="handleAddButton"
                  >
                    <i class="el-icon-plus text-lg" />
                    <span class="ml-3 break-all">{{ $t('common.add_new') }}</span>
                  </button>
                </template>
              </div>
            </template>
            <!-- Add new button end -->
          </div>

          <!-- view folder button -->
          <div
            v-if="getRouteBaseName()==='vault'"
            class="self-center"
          >
            <button
              class="btn btn-icon hover:bg-[#E5E5E5]"
              :class="viewFolder?'bg-[#E5E5E5]':''"
              @click="viewFolder=!viewFolder"
            >
              <!-- <i v-if="!viewFolder" class="fas fa-folder-open" @click="viewFolder=true" /> -->
              {{ $t('common.view_folder') }}
              <span><i
                :class="viewFolder?'fas':'far'"
                class="fa-folder cursor-pointer"
              /></span>
            </button>
          </div>
          <!-- view folder button -->
        </div>

        <!-- number of items -->
        <div
          v-if="ciphers && !viewFolder"
          class="uppercase text-head-6"
        >
          <span class="text-primary font-semibold">{{ ($store.state.syncing && cipherCount!=null)?cipherCount : ciphers.length }}</span> {{ $tc('type.0', ciphers.length) }}
        </div>
        <div
          v-if="folders && viewFolder"
          class="uppercase text-head-6"
        >
          <span class="text-primary font-semibold">{{ folders.length }}</span> {{ $tc('type.Folder', folders.length) }}
        </div>
        <!-- number of items end -->
      </div>
      <!-- Overview end -->

      <div class="flex items-center justify-end content-end mb-5">
        <!-- Sort menu -->
        <div v-if="!viewFolder" class="header-actions">
          <div class="flex">
            <el-dropdown trigger="click" class="self-center">
              <div class="text-sm text-black-600 font-semibold">
                {{ $t('data.ciphers.sort_by') }} <i class="el-icon-caret-bottom el-icon--right" />
              </div>
              <el-dropdown-menu slot="dropdown" class="w-[200px] ">
                <el-dropdown-item
                  v-if="isSearching"
                  class="flex items-center justify-between"
                  @click.native="changeSort('', '')"
                >
                  <span>{{ $t('data.ciphers.most_relevant') }}</span>
                  <i v-if="orderString==='_'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('name', 'asc')"
                >
                  <span>{{ $t('data.ciphers.name') }} {{ $t('data.ciphers.ascending') }}</span>
                  <i v-if="orderString==='name_asc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('name', 'desc')"
                >
                  <span>{{ $t('data.ciphers.name') }} {{ $t('data.ciphers.descending') }}</span>
                  <i v-if="orderString==='name_desc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('revisionDate', 'asc')"
                >
                  <span>{{ $t('data.ciphers.time') }} {{ $t('data.ciphers.ascending') }}</span>
                  <i v-if="orderString==='revisionDate_asc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('revisionDate', 'desc')"
                >
                  <span>{{ $t('data.ciphers.time') }} {{ $t('data.ciphers.descending') }}</span>
                  <i v-if="orderString==='revisionDate_desc'" class="fa fa-check" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- List Folders -->
      <div
        v-if="getRouteBaseName() === 'vault' && (folders || collections) && viewFolder"
        class="mb-10"
      >
        <client-only>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-6 ">
            <!-- Collection - Shared -->
            <template v-for="item in collections">
              <div
                v-if="searchText.length<=1||(searchText.length>1&&item.ciphersCount>0)"
                :key="item.id"
                class="px-4 py-4 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                :class="{'border-primary': selectedFolder.id === item.id}"
                :title="item.name"
              >
                <!-- NOTE: if you want to enable right click menu, add @contextmenu.prevent="$refs.menu.open($event, item)" to button and uncomment bellow context code -->
                <!-- Icon -->
                <img
                  src="~/assets/images/icons/folderSolidShare.svg"
                  alt=""
                  class="select-none mr-2"
                  @click="routerFolder(item)"
                >
                <!-- Icon end -->

                <!-- Name + count -->
                <div
                  class="font-semibold truncate select-none line-clamp-1 flex-1"
                  @click="routerFolder(item)"
                >
                  {{ item.name }}
                  <div class="text-black-500">{{ item.ciphersCount }} {{ item.ciphersCount>1?'items':'item' }}</div>
                </div>
                <!-- Name + count end -->

                <!-- Actions -->
                <el-dropdown
                  v-if="!isProtectedCipher(item)"
                  trigger="click"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="canManageItem(organizations, item)"
                      @click.native="addEditFolder(item, false)"
                    >
                      {{ $t('common.rename') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="isOwner(organizations, item)"
                      @click.native="shareFolder(item)"
                    >
                      {{ $t('common.share') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="item.organizationId && isOwner(organizations, item)"
                      @click.native="stopSharing(item)"
                    >
                      {{ $t('data.ciphers.stop_sharing') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="canManageItem(organizations, item)"
                      @click.native="deleteFolder(item)"
                    >
                      <span class="text-danger">{{ $t('common.delete') }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Actions end -->
              </div>
            </template>
            <!-- Collection - Shared end -->

            <!-- Folder -->
            <template v-for="item in folders">
              <div
                v-if="searchText.length<=1||(searchText.length>1&&item.ciphersCount>0)"
                :key="item.id"
                class="px-4 py-4 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                :class="{'border-primary': selectedFolder.id === item.id}"
                :title="item.name"
              >
                <!-- Icon -->
                <img
                  src="~/assets/images/icons/folderSolid.svg"
                  alt=""
                  class="select-none mr-2"
                  @click="routerFolder(item)"
                >
                <!-- Icon end -->

                <!-- Name + count -->
                <div
                  class="font-semibold truncate select-none line-clamp-1 flex-1"
                  @click="routerFolder(item)"
                >
                  {{ item.name }}
                  <div class="text-black-500">{{ item.ciphersCount }} {{ item.ciphersCount>1?'items':'item' }}</div>
                </div>
                <!-- Name + count end -->

                <!-- Actions -->
                <el-dropdown
                  v-if="!isProtectedCipher(item)"
                  trigger="click"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="canManageItem(organizations, item)"
                      @click.native="addEditFolder(item, false)"
                    >
                      {{ $t('common.rename') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="isOwner(organizations, item)"
                      @click.native="shareFolder(item)"
                    >
                      {{ $t('common.share') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="item.organizationId && isOwner(organizations, item)"
                      @click.native="stopSharing(item)"
                    >
                      {{ $t('data.ciphers.stop_sharing') }}
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="canManageItem(organizations, item)"
                      @click.native="deleteFolder(item)"
                    >
                      <span class="text-danger">{{ $t('common.delete') }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Actions end -->
              </div>
            </template>
            <!-- Folder end -->

            <!-- Context menu -->
            <!-- <component
              :is="context"
              ref="menu"
              class="el-dropdown-menu"
              @open="openContextFolder"
            >
              <template #default>
                <li
                  v-if="canManageItem(organizations, selectedFolder)"
                  class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="addEditFolder(selectedFolder, false)"
                >
                  {{ $t('common.rename') }}
                </li>
                <li
                  v-if="isOwner(organizations, selectedFolder)"
                  class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="shareFolder(selectedFolder)"
                >
                  {{ $t('common.share') }}
                </li>
                <li
                  v-if="selectedFolder.organizationId && isOwner(organizations, selectedFolder)"
                  class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="stopSharing(selectedFolder)"
                >
                  {{ $t('data.ciphers.stop_sharing') }}
                </li>
                <li
                  v-if="canManageItem(organizations, selectedFolder)"
                  class="el-dropdown-menu__item"
                  @click.prevent="deleteFolder(selectedFolder)"
                >
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </li>
              </template>
            </component>-->
            <!-- Context menu end -->
          </div>
        </client-only>
      </div>
      <!-- List Folder end -->

      <!-- List Ciphers -->
      <client-only v-if="!viewFolder">
        <RecycleScroller
          ref="list"
          page-mode
          :item-size="65"
          :items="ciphers || []"
        >
          <template slot="before">
            <div class="th flex">
              <!-- Check all -->
              <div class="self-center mr-1">
                <el-checkbox
                  v-model="checkedAll"
                  :class="checkedAll?'!visible':''"
                  @change="checkAll"
                />
              </div>
              <!-- Check all end -->

              <div
                v-if="multipleSelection.length"
                class="flex items-center "
              >
                <div class="text-black mr-8 whitespace-nowrap">
                  {{ multipleSelection.length }} {{ $t('data.ciphers.selected_items') }}
                </div>
                <div v-if="deleted">
                  <button
                    class="btn btn-default btn-xs"
                    @click="restoreCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.restore') }}
                  </button>
                  <button
                    class="btn btn-default btn-xs !text-danger"
                    @click="deleteCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.permanently_delete') }}
                  </button>
                </div>
                <div
                  v-else
                  class=""
                >
                  <button
                    class="btn btn-default btn-xs"
                    @click="moveFolders(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.move_folder') }}
                  </button>
                  <button
                    class="btn btn-default btn-xs !text-danger"
                    @click="moveTrashCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.delete') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Headers -->
            <div
              v-for="header in headers"
              :key="header"
              class="th"
            >
              {{ header }}
            </div>
            <!-- Headers end -->
          </template>

          <template #default="{item}">
            <div class="td">
              <div class="flex items-center">
                <!-- Checkbox -->
                <div class="mr-4">
                  <el-checkbox
                    :disabled="isProtectedCipher(item)"
                    :value="item.checked?true:false"
                    :class="item.checked?'!visible':''"
                    @change="changeSelection(item)"
                  />
                </div>
                <!-- Checkbox end -->

                <!-- Icon -->
                <div
                  class="text-[34px] mr-3 flex-shrink-0"
                  :class="{'filter grayscale': item.isDeleted}"
                >
                  <Vnodes :vnodes="getIconCipher(item, 34)" />
                </div>
                <!-- Icon end -->

                <!-- Info block -->
                <div class="flex flex-col overflow-hidden">
                  <!-- Name -->
                  <a
                    class="text-black font-semibold truncate flex items-center"
                    :class="{'opacity-80': item.isDeleted}"
                    @click="routerCipher(item, addEdit)"
                  >
                    <span class="overflow-hidden overflow-ellipsis">{{ item.name }}</span>
                    <img
                      v-if="item.organizationId"
                      src="~/assets/images/icons/shares.svg"
                      alt="Shared"
                      :title="$t('common.shared_with_you')"
                      class="inline-block ml-2"
                    >
                  </a>
                  <!-- Name end -->

                  <!-- Subtitle -->
                  <div class="overflow-hidden overflow-ellipsis">
                    {{ item.type === CipherType.CryptoWallet && item.cryptoWallet ? item.cryptoWallet.username : item.subTitle }}
                  </div>
                  <!-- Subtitle end -->
                </div>
                <!-- Info block end -->
              </div>
            </div>

            <!-- Updated time -->
            <div class="td">
              <span class="break-normal">{{ $moment(item.revisionDate).fromNow() }}</span>
            </div>
            <!-- Updated time end -->

            <!-- Actions -->
            <div class="td">
              <div class="col-actions text-right">
                <!-- Go to website -->
                <button
                  v-if="!item.isDeleted && item.login.canLaunch"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.go_to_website')"
                  @click="openNewTab(item.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <!-- Go to website end -->

                <!-- Copy -->
                <el-dropdown
                  v-if="!item.isDeleted && [CipherType.Login, CipherType.SecureNote, CipherType.CryptoWallet, CipherType.MasterPassword].includes(item.type)"
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="far fa-clone" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="item.type === CipherType.Login">
                      <el-dropdown-item
                        v-clipboard:copy="item.login.username"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.username') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="item.login.password"
                        v-clipboard:success="clipboardSuccessHandler"
                        :disabled="!canViewItem(organizations, item)"
                      >
                        {{ $t('common.copy') }} {{ $t('common.password') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="item.type === CipherType.MasterPassword">
                      <el-dropdown-item
                        v-clipboard:copy="item.login.password"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.password') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="item.type === CipherType.SecureNote">
                      <el-dropdown-item
                        v-clipboard:copy="item.notes"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.note') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="item.type === CipherType.CryptoWallet && item.cryptoWallet">
                      <el-dropdown-item
                        v-clipboard:copy="item.cryptoWallet.seed"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('data.ciphers.seed') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="item.cryptoWallet.address"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('data.ciphers.wallet_address') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="item.cryptoWallet.privateKey"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('data.ciphers.private_key') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="item.cryptoWallet.password"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('data.ciphers.password_pin') }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Copy end -->

                <!-- Share -->
                <button
                  v-if="!item.isDeleted && isOwner(organizations, item) && !item.collectionIds.length && !isProtectedCipher(item)"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.share')"
                  @click="shareItem(item)"
                >
                  <i class="far fa-share-square" />
                </button>
                <!-- Share end -->

                <!-- Other actions -->
                <el-dropdown
                  v-if="!isProtectedCipher(item)"
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="!item.isDeleted">
                      <el-dropdown-item v-if="canManageItem(organizations, item)" @click.native="addEdit(item)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        @click.native="cloneCipher(item)"
                      >
                        {{ $t('common.clone') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="isOwner(organizations, item)" @click.native="moveFolders([item.id])">
                        {{ $t('common.move_folder') }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="isOwner(organizations, item) && item.organizationId && !item.collectionIds.length" @click.native="stopSharing(item)">
                        {{ $t('data.ciphers.stop_sharing') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="isOwner(organizations, item)"
                        divided
                        @click.native="moveTrashCiphers([item.id])"
                      >
                        <span class="text-danger">{{ $t('common.delete') }}</span>
                      </el-dropdown-item>
                    </template>
                    <template v-else-if="isOwner(organizations, item)">
                      <el-dropdown-item
                        @click.native="restoreCiphers([item.id])"
                      >
                        {{ $t('common.restore') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteCiphers([item.id])">
                        <span class="text-danger">{{ $t('common.permanently_delete') }}</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Other actions end -->
              </div>
            </div>
            <!-- Actions end -->
          </template>
        </RecycleScroller>
      </client-only>
      <!-- List Ciphers end -->
    </div>

    <!-- No cipher -->
    <NoCipher
      v-else-if="!$store.state.syncing"
      :type="type"
      @add-cipher="handleAddButton"
    />
    <!-- No cipher end -->

    <AddEditCipher
      ref="addEditCipherDialog"
      :type="type"
      @reset-selection="multipleSelection = []"
      @trashed-cipher="multipleSelection = []"
    />

    <ChooseCipherType ref="chooseCipherType" />

    <AddEditFolder ref="addEditFolder" />

    <AddEditTeamFolder ref="addEditTeamFolder" />

    <AddEditTeamFolderUsers ref="addEditTeamFolderUsers" />

    <AddEditTeamFolderGroups ref="addEditTeamFolderGroups" />

    <ShareCipher
      ref="shareCipher"
      @upgrade-plan="upgradePlan"
    />

    <ShareFolder ref="shareFolder" />

    <MoveFolder
      ref="moveFolder"
      @reset-selection="multipleSelection = []"
    />

    <PremiumDialog ref="premiumDialog" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import AddEditCipher from '../../components/cipher/AddEditCipher'
import AddEditFolder from '../folder/AddEditFolder'
import AddEditTeamFolder from '../folder/AddEditTeamFolder'
import AddEditTeamFolderUsers from '../folder/AddEditTeamFolderUsers'
import AddEditTeamFolderGroups from '../folder/AddEditTeamFolderGroups'
import ShareCipher from '../../components/cipher/ShareCipher'
import ShareFolder from '../../components/folder/ShareFolder'
import MoveFolder from '../folder/MoveFolder'
import NoCipher from '../../components/cipher/NoCipher'
import { CipherType } from '../../core/enums/cipherType'
import Vnodes from '../../components/Vnodes'
import ChooseCipherType from '../../components/cipher/ChooseCipherType'
import PremiumDialog from '../../components/upgrade/PremiumDialog.vue'
import { CipherRequest } from '../../jslib/src/models/request'

export default {
  components: {
    ChooseCipherType,
    AddEditCipher,
    AddEditFolder,
    AddEditTeamFolder,
    ShareCipher,
    ShareFolder,
    MoveFolder,
    NoCipher,
    AddEditTeamFolderUsers,
    AddEditTeamFolderGroups,
    VueContext: () => import('../../plugins/vue-context'),
    Vnodes,
    PremiumDialog
  },
  props: {
    deleted: {
      type: Boolean,
      default: false
    },
    routeName: {
      type: String,
      default: 'passwords'
    },
    filter: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      cryptoService: null,
      data: {},
      CipherType,
      multipleSelection: [],
      loading: true,
      orderField: 'revisionDate', // revisionDate
      orderDirection: 'desc',
      selectedFolder: {},
      context: '',
      publicKey: '',
      indexing: false,
      index: null,
      menuVault: [
        {
          label: 'all',
          routeName: 'vault',
          icon: 'all'
        },
        {
          label: 'passwords',
          routeName: 'passwords',
          icon: 'passwords'
        },
        {
          label: 'notes',
          routeName: 'notes',
          icon: 'notes'
        },
        {
          label: 'cards',
          routeName: 'cards',
          icon: 'cards'
        },
        {
          label: 'identities',
          routeName: 'identities',
          icon: 'identities'
        },
        {
          label: 'crypto_backups',
          routeName: 'crypto-backups',
          icon: 'passwords'
        }
      ],
      menuShares: [
        {
          label: 'shared_with_you',
          routeName: 'shares'
        },
        {
          label: 'your_shares',
          routeName: 'shares-your-shares'
        },
        {
          label: 'requests',
          routeName: 'shares-requests'
        }
      ],
      dataRendered: [],
      renderIndex: 0,
      selectedType: 'Login',
      viewFolder: false,
      showLogo: this.$cookies.get('show-logo') || false,
      folders: [],
      collections: [],
      checkedAll: false
    }
  },
  computed: {
    headers () {
      return [this.$t('data.ciphers.updated_time'), this.$t('common.actions')]
    },
    options () {
      return [
        {
          label: this.$tc('type.Login', 1),
          value: 'Login'
        },
        {
          label: this.$tc('type.SecureNote', 1),
          value: 'SecureNote'
        },
        {
          label: this.$tc('type.Card', 1),
          value: 'Card'
        },
        {
          label: this.$tc('type.Identity', 1),
          value: 'Identity'
        },
        {
          label: this.$tc('type.CryptoBackup', 1),
          value: 'CryptoBackup'
        },
        {
          label: this.$tc('type.Folder', 1),
          value: 'Folder'
        }
      ]
    },
    folder () {
      if (this.folders) {
        return find(this.folders, e => e.id === this.$route.params.folderId) || {}
      }
      return {}
    },
    collection () {
      if (this.collections) {
        return find(this.collections, e => e.id === this.$route.params.folderId) || { name: 'Unassigned Folder' }
      }
      return {}
    },
    orderString () {
      return `${this.orderField}_${this.orderDirection}`
    },
    type () {
      switch (this.routeName) {
      case 'passwords':
        return 'Login'
      case 'notes':
        return 'SecureNote'
      case 'cards':
        return 'Card'
      case 'identities':
        return 'Identity'
      case 'crypto-backups':
        return 'CryptoBackup'
      case 'vault':
        return 'Vault'
      case 'shares':
        return 'Shares'
      case 'trash':
        return 'Trash'
      default:
        return null
      }
    },
    filteredCiphers () {
      // if (this.getRouteBaseName() === 'vault' && this.ciphers) {
      //   return this.ciphers.filter(e => !e.folderId)
      // }
      return this.ciphers || []
    },
    shouldRenderNoCipher () {
      const haveCipher = this.filteredCiphers.length
      if (this.getRouteBaseName() === 'vault') {
        return this.folders && !this.folders.length && !haveCipher
      }
      if (this.getRouteBaseName() === 'shares') {
        return this.collections && !this.collections.length
      }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        return false
      }
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId') {
        return false
      }
      return !haveCipher && !this.searchText
      // return true
    },
    shouldRenderShare () {
      return (this.getRouteBaseName() === 'shares')
    },
    canManageTeamFolder () {
      return this.teams.some(e => ['owner', 'admin', 'manager'].includes(e.role))
    },
    canCreateTeamFolder () {
      return this.teams.some(e => ['owner', 'admin'].includes(e.role))
    },
    writeableCollections () {
      if (!this.collections || !this.organizations) {
        return []
      }
      return this.collections.filter(item => {
        const _type = this.getTeam(this.organizations, item.organizationId).type
        return _type === 0
      })
    },
    canAddItem () {
      let res = !['shares', 'trash'].includes(this.routeName)
      const collection = find(this.collections, e => e.id === this.$route.params.folderId)
      if (collection) {
        res &= this.writeableCollections.some(c => c.id === collection.id)
      }
      return res
    },
    isSearching () {
      return this.searchText && this.searchText.trim().length > 0
    }
  },
  watch: {
    ciphers () {
      if (this.ciphers) {
        this.loading = false
      }
    },
    isSearching (newVal) {
      if (newVal) {
        this.changeSort('', '')
      } else {
        this.changeSort('revisionDate', 'desc')
      }
    }
  },
  async mounted () {
    this.context = 'VueContext'
  },
  asyncComputed: {
    ciphers: {
      async get () {
        // this.loading = true
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        let result = []
        try {
          result = await this.$searchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
        } catch (error) {
        }
        // remove ciphers generated by authenticator
        result = result.filter(cipher => [
          CipherType.Login,
          CipherType.SecureNote,
          CipherType.Card,
          CipherType.Identity,
          CipherType.CryptoWallet,
          CipherType.MasterPassword
        ].includes(cipher.type))
        result.map(item => {
          if (item.type === CipherType.CryptoWallet) {
            try {
              item.cryptoWallet = JSON.parse(item.notes)
              // item.notes = item.cryptoWallet ? item.cryptoWallet.notes : ''
            } catch (error) {
              console.log(error)
            }
          }
          return {
            ...item,
            checked: false
          }
        })
        if (this.orderField && this.orderDirection) {
          result = orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
        }
        // this.dataRendered = result.slice(0, 50)
        // this.renderIndex = 50
        return result
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    },
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
    folders: {
      async get () {
        let folders = []
        try {
          folders = await this.$folderService.getAllDecrypted() || []
        } catch (error) {

        }
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.folderId === f.id) || [])
          f.ciphersCount = ciphers && ciphers.length
          f.ciphers = ciphers
        })
        return folders
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    },
    collections: {
      async get () {
        if (this.$store.state.syncing) {
          return
        }
        let collections = []
        try {
          collections = await this.$collectionService.getAllDecrypted() || []
        } catch (error) {

        }
        collections = collections.filter(f => f.id)
        collections.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
          f.ciphers = ciphers
        })
        if (!this.$store.state.syncing) {
          this.loading = false
        }
        return collections
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    }
  },
  methods: {
    isProtectedCipher (cipher) {
      return cipher.type === CipherType.MasterPassword
    },
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    handleAddButton () {
      if (this.getRouteBaseName() === 'vault-tfolders-tfolderId' && !this.collection.readOnly) {
        this.addEdit({
          organizationId: this.collection.organizationId
        })
      } else if (!['vault', 'shares'].includes(this.getRouteBaseName())) {
        this.addEdit({})
      } else {
        this.chooseCipherType()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeSelection (item) {
      item.checked = !item.checked || false
      if (item.checked) {
        this.multipleSelection.push(item)
      } else {
        const index = this.multipleSelection.indexOf(item)
        if (index > -1) {
          this.multipleSelection.splice(index, 1)
        }
      }
    },
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, true)
    },
    moveFolders (ids) {
      if (ids.length === 1) {
        const cipher = this.ciphers.find(c => c.id === ids[0])
        this.$refs.moveFolder.folderId = cipher ? (cipher.collectionIds && cipher.collectionIds.length) ? cipher.collectionIds[0] : cipher.folderId : null
      } else {
        this.$refs.moveFolder.folderId = null
      }
      this.$refs.moveFolder.openDialog(ids)
    },
    deleteCiphers (ids) {
      this.$refs.addEditCipherDialog.deleteCiphers(ids)
    },
    restoreCiphers (ids) {
      this.$refs.addEditCipherDialog.restoreCiphers(ids)
    },
    moveTrashCiphers (ids) {
      this.$refs.addEditCipherDialog.moveTrashCiphers(ids)
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    },
    routerFolder (item) {
      this.$router.push(this.localeRoute({
        name: 'vault-folders-folderId',
        params: { folderId: item.id }
      }))
    },
    routerCollection (item) {
      if (item.id === 'unassigned') {
        this.$router.push(this.localeRoute({
          name: 'vault-teams-teamId-tfolders-tfolderId',
          params: { teamId: item.organizationId, tfolderId: item.id }
        }))
      } else {
        this.$router.push(this.localeRoute({
          name: 'vault-teams-teamId-tfolders-tfolderId',
          params: { teamId: item.organizationId, tfolderId: item.id }
        }))
      }
    },
    openContextFolder (event, data) {
      this.selectedFolder = data
    },
    openContextTeamFolder (event, data) {
      this.selectedFolder = data
      // console.log(this.selectedFolder)
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    },
    addEditTeamFolder (folder, shouldRedirect = false) {
      this.$refs.addEditTeamFolder.openDialog(folder, shouldRedirect)
    },
    deleteFolder (folder) {
      this.$refs.addEditFolder.deleteFolder(folder)
    },
    deleteTeamFolder (folder) {
      this.$refs.addEditTeamFolder.deleteFolder(folder)
    },
    shareItem (cipher) {
      this.$refs.shareCipher.openDialog(cipher)
    },
    shareFolder (folder) {
      this.$refs.shareFolder.openDialog(folder)
    },
    putTeamFolderGroups (folder) {
      this.$refs.addEditTeamFolderGroups.openDialog(folder)
    },
    putTeamFolderUsers (folder) {
      this.$refs.addEditTeamFolderUsers.openDialog(folder)
    },
    chooseCipherType () {
      this.$refs.chooseCipherType.openDialog()
    },
    countUnassignedItems (ciphers = [], organizationId) {
      if (ciphers) {
        const filteredCipher = ciphers.filter(c => c.organizationId === organizationId && c.collectionIds.length === 0)
        return filteredCipher.length
      }
      return 0
    },
    canDeleteTeamFolder (team) {
      return ['owner', 'admin'].includes(team.role) && !team.locked
    },
    confirmDialog (type) {
      if (type === 'Folder') {
        this.addEditFolder()
      } else {
        this.$refs.chooseCipherType.confirmDialog(type)
      }
      this.dialogVisible = false
    },
    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
      this.$refs.premiumDialog.openDialog()
    },
    checkAll () {
      if (this.checkedAll) {
        this.multipleSelection = []
        this.ciphers.forEach(cipher => {
          if (!this.isProtectedCipher(cipher)) {
            cipher.checked = true
            this.multipleSelection.push(cipher)
          }
        })
      } else {
        this.ciphers.forEach(cipher => {
          cipher.checked = false
          this.multipleSelection = []
        })
      }
    },
    async stopSharing (cipher) {
      try {
        if (cipher.ciphers) {
          let memberId = null
          if (cipher.user) {
            memberId = cipher.user.id
            delete cipher.user
          }
          let folderNameEnc = await this.$cryptoService.encrypt(cipher.name)
          folderNameEnc = folderNameEnc.encryptedString
          const ciphers = await Promise.all(cipher.ciphers.map(async cipher => {
            const type_ = cipher.type
            if (type_ === 7) {
              cipher.type = CipherType.SecureNote
              cipher.secureNote.type = 0
            }
            const cipherEnc = await this.$cipherService.encrypt(cipher, this.$cryptoService.getEncKey())
            const data = new CipherRequest(cipherEnc)
            data.type = type_
            cipher.type = type_
            return {
              id: cipher.id,
              ...data
            }
          }))
          const payload = {
            folder: {
              id: cipher.id,
              name: folderNameEnc,
              ciphers
            }
          }
          memberId ? await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`, payload) : await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/stop`, payload)
        } else {
          let memberId = null
          if (cipher.user) {
            memberId = cipher.user.id
            delete cipher.user
          }
          const type_ = cipher.type
          if (type_ === 7) {
            cipher.type = CipherType.SecureNote
            cipher.secureNote.type = 0
          }
          const personalKey = await this.$cryptoService.getEncKey()
          const cipherEnc = await this.$cipherService.encrypt(cipher, personalKey)
          const data = new CipherRequest(cipherEnc)
          // console.log(data)
          data.type = type_
          cipher.type = type_
          memberId
            ? await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`, {
              folder: null,
              cipher: { ...data, id: cipher.id }
            })
            : await this.$axios.$post(`cystack_platform/pm/sharing/${cipher.organizationId}/stop`, {
              folder: null,
              cipher: { ...data, id: cipher.id }
            })
        }
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'success')
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${cipher.type || 'Folder'}`, 1) }), 'warning')
      }
    }
  }
}
</script>
<style>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.vue-recycle-scroller__slot,
.vue-recycle-scroller__item-view {
  display: flex;
  align-items: center;
  width: 100%;
}
.vue-recycle-scroller__item-view {
  @apply border-t-[1px] border-black-400 pt-2 mt-2;
}
.th,
.td {
  flex: 1;
}
.vue-recycle-scroller__slot .th:first-child,
.vue-recycle-scroller__item-view .td:first-child {
  @apply truncate;
  flex: 2;
}
.vue-recycle-scroller__slot .th:nth-child(2),
.vue-recycle-scroller__item-view .td:nth-child(2) {
  margin-left: 40px;
}
.vue-recycle-scroller__item-view .td .items-center .mr-4 .el-checkbox {
  visibility: hidden;
}
.vue-recycle-scroller__item-view:hover .td .items-center .mr-4 .el-checkbox{
  visibility: visible !important;
}
.vue-recycle-scroller__slot .th .self-center .el-checkbox {
  visibility: hidden;
}
.vue-recycle-scroller__slot:hover .th .self-center .el-checkbox {
  visibility: visible !important;
}
.th:last-child {
  text-align: right;
}
</style>
