<template>
  <div
    v-loading="loading"
    class="flex flex-col flex-column-fluid relative"
  >
    <!-- Navigation Menu -->
    <div class="navigation-bar">
      <template v-if="['vault', 'passwords', 'notes', 'identities', 'cards'].includes(getRouteBaseName())">
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
      </template>
    </div>
    <!-- Navigation Menu end -->

    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 px-10 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex justify-between">
          <div class="flex items-center">
            <div class="text-head-4">
              <template v-if="getRouteBaseName() === 'vault-folders-folderId'">
                <nuxt-link
                  class="font-medium hover:no-underline"
                  :to="localeRoute({name: 'vault'})"
                >
                  {{ $t('sidebar.vault') }}
                </nuxt-link>
                <span class="font-medium">
                  &nbsp; / &nbsp; {{ folder.name }}
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
                <span class="font-medium">All items</span>
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
            <template v-if="!['shares', 'trash'].includes(routeName)">
              <div class="mx-6 text-head-4"> | </div>
              <div class="self-center">
                <el-dropdown
                  v-if="routeName==='vault'"
                  trigger="click"
                >
                  <button class="btn btn-outline-primary">
                    <i class="el-icon-plus text-lg" />
                    <span class="ml-3 break-all">Add new</span>
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in options"
                      :key="item.value"
                      :value="item.value"
                      class="flex items-center justify-between"
                      @click.native="confirmDialog(item.value)"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <template v-else>
                  <button
                    class="btn btn-outline-primary"
                    @click="handleAddButton"
                  >
                    <i class="el-icon-plus text-lg" />
                    <span class="ml-3 break-all">Add new</span>
                  </button>
                </template>
              </div>
            </template>
          </div>
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
              View in folder
              <span><i
                :class="viewFolder?'fas':'far'"
                class="fa-folder cursor-pointer"
              /></span>
            </button>
          </div>
        </div>
        <div
          v-if="ciphers && !viewFolder"
          class="uppercase text-head-6"
        >
          <span class="text-primary font-semibold">{{ ($store.state.syncing && cipherCount!=null)?cipherCount : ciphers.length }}</span> {{ $tc('type.0', ciphers.length) }}
          <!-- <el-tooltip
            :content="'Show logo: ' + showLogo"
            placement="top"
          >
            <el-switch
              v-model="showLogo"
              @change="changeShowLogo"
            />
          </el-tooltip> -->
          <!-- {{ decryptedCiphers.length }} -->
        </div>
        <div
          v-if="folders && viewFolder"
          class="uppercase text-head-6"
        >
          <span class="text-primary font-semibold">{{ folders.length }}</span> {{ $tc('type.Folder', folders.length) }}
        </div>
      </div>
      <!-- Overview end -->

      <!-- Details -->
      <div class="flex items-center justify-between mb-5">
        <!-- Folder Navigation -->
        <!-- <div class="flex-grow">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-if="getRouteBaseName() === 'vault-folders-folderId'">
              <el-breadcrumb-item
                :to="localeRoute({name: 'vault'})"
              >
                {{ $t('sidebar.vault') }}
              </el-breadcrumb-item>
              <el-breadcrumb-item class="flex items-center">
                {{ folder.name }}
              </el-breadcrumb-item>
            </template>
            <template v-else-if="getRouteBaseName() === 'vault-teams-teamId-tfolders-tfolderId'">
              <el-breadcrumb-item
                :to="localeRoute({name: 'vault'})"
              >
                {{ $t('sidebar.vault') }}
              </el-breadcrumb-item>
              <el-breadcrumb-item class="flex items-center">
                {{ getTeam(teams, $route.params.teamId).name }} - {{ collection.name }}
              </el-breadcrumb-item>
            </template>
            <template v-else-if="getRouteBaseName() ==='vault'">
              <span class="font-medium">Folders</span>
            </template>
            <template v-else-if="getRouteBaseName() ==='shares'">
              <span class="font-medium">Shares</span>
            </template>
            <template v-else-if="getRouteBaseName() ==='trash'">
              <span class="font-medium">Trash</span>
            </template>
            <template v-else>
              <el-breadcrumb-item
                :to="localeRoute({name: routeName})"
              >
                {{ $tc(`type.${type}`, 2) }}
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div> -->
        <!-- Folder Navigation end -->

        <!-- <div class="header-actions">
          <div class="flex">
            <button v-if="!['vault-folders-folderId', 'vault-teams-teamId-tfolders-tfolderId', 'vault', 'shares', 'trash'].includes(getRouteBaseName())" class="px-4 py-2 flex items-center cursor-pointer btn-default rounded justify-center font-semibold mr-3" @click="handleAddButton">
              <i class="el-icon-circle-plus-outline text-lg" />
              <div class="ml-3 break-all">Add new</div>
            </button>
            <el-dropdown trigger="click" class="self-center">
              <div class="text-sm text-black-600 font-semibold">
                {{ $t('data.ciphers.sort_by') }} <i class="el-icon-caret-bottom el-icon--right" />
              </div>
              <el-dropdown-menu slot="dropdown" class="w-[200px] ">
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
        </div> -->
      </div>

      <!-- List Folders -->
      <div
        v-if="getRouteBaseName() === 'vault' && folders && viewFolder"
        class="mb-10"
      >
        <client-only>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-6 ">
            <template v-for="item in folders">
              <div
                v-if="searchText.length<=1||(searchText.length>1&&item.ciphersCount>0)"
                :key="item.id"
                class="px-4 py-4 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                :class="{'border-primary': selectedFolder.id === item.id}"
                :title="item.name"
                @click="routerFolder(item)"
                @contextmenu.prevent="$refs.menu.open($event, item)"
              >
                <img
                  src="~/assets/images/icons/folderSolid.svg"
                  alt=""
                  class="select-none mr-2"
                >
                <div class="font-semibold truncate select-none line-clamp-1">
                  {{ item.name }}
                  <div class="text-black-500">{{ item.ciphersCount }} {{ item.ciphersCount>1?'items':'item' }}</div>
                </div>
              </div>
            </template>
            <!-- <div class="px-4 py-4 flex items-center cursor-pointer rounded border border-dashed border-[#E6E6E8] hover:border-primary justify-center font-semibold" @click="addEditFolder">
              <i class="el-icon-circle-plus-outline text-lg" />
              <div class="ml-3 break-all">New Folder</div>
            </div> -->
            <component
              :is="context"
              ref="menu"
              class="el-dropdown-menu"
              @open="openContextFolder"
            >
              <template #default>
                <li
                  class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="addEditFolder(selectedFolder, false)"
                >
                  {{ $t('common.rename') }}
                </li>
                <li
                  class="el-dropdown-menu__item w-[200px]"
                  @click.prevent="shareFolder(selectedFolder)"
                >
                  {{ $t('common.share') }}
                </li>
                <li
                  class="el-dropdown-menu__item"
                  @click.prevent="deleteFolder(selectedFolder)"
                >
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </li>
              </template>
            </component>
          </div>
        </client-only>
      </div>
      <!-- List Folder end -->

      <!-- List Shared Folder -->
      <!-- <div
        v-if="getRouteBaseName() === 'vault' && collections && viewFolder"
        class="mb-10"
      >
        <client-only>
          <template v-for="(value, key) in filteredCollection">
            <div :key="key" class="mb-5 font-medium">
              {{ getTeam(teams, key).name }}
            </div>
            <div :key="key" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-6 ">
              <template v-for="item in value">
                <div
                  v-if="searchText.length<=1||(searchText.length>1&&item.ciphersCount>0)"
                  :key="item.id"
                  class="px-4 py-4 cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                  :class="{'border-primary': selectedFolder.id === item.id}"
                  :title="`${item.name} (${item.ciphersCount})`"
                  @click="routerCollection(item)"
                  @contextmenu.prevent="canManageFolder(teams, item) ? $refs.menuTeam.open($event, item) : null"
                >
                  <div class="flex items-center">
                    <img src="~/assets/images/icons/folderSolidShare.svg" alt="" class="select-none mr-2">
                    <div class="font-semibold truncate select-none">
                      {{ item.name }}
                      <div class="text-black-500">{{ item.ciphersCount }} {{ item.ciphersCount>1?'items':'item' }}</div>
                    </div>
                  </div>
                </div>
              </template>
              <div
                v-if="searchText.length<=1||(searchText.length>1&&countUnassignedItems(ciphers, key)>0)"
                class="px-4 py-4 cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
                :class="{'border-primary': selectedFolder.id === 'unassigned'}"
                @click="routerCollection({id: 'unassigned', organizationId: key})"
              >
                <div class="flex items-center">
                  <img src="~/assets/images/icons/folderSolid.svg" alt="" class="select-none mr-2">
                  <div class="font-semibold truncate select-none">
                    {{ $t('data.ciphers.unassigned_folder') }}
                    <div class="text-black-500">{{ countUnassignedItems(ciphers, key) }} {{ countUnassignedItems(ciphers, key)>1?'items':'item' }}</div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-4 flex items-center cursor-pointer rounded border border-dashed border-[#E6E6E8] hover:border-primary justify-center font-semibold" @click="addEditTeamFolder">
                <i class="el-icon-circle-plus-outline text-lg" />
                <div class="ml-3 break-all">New Team folder</div>
              </div>
            </div>
          </template>
          <component
            :is="context"
            ref="menuTeam"
            class="el-dropdown-menu"
            @open="openContextTeamFolder"
          >
            <template #default>
              <li
                class="el-dropdown-menu__item w-[200px]"
                @click.prevent="addEditTeamFolder(selectedFolder, false)"
              >
                {{ $t('common.rename') }}
              </li>
              <li
                v-if="isBiz(getTeam(teams, selectedFolder.organizationId))"
                class="el-dropdown-menu__item w-[200px]"
                @click.prevent="putTeamFolderUsers(selectedFolder)"
              >
                {{ $t('data.groups.user_access') }}
              </li>
              <li
                v-if="isBiz(getTeam(teams, selectedFolder.organizationId))"
                class="el-dropdown-menu__item w-[200px]"
                @click.prevent="putTeamFolderGroups(selectedFolder)"
              >
                {{ $t('data.folders.groups_access') }}
              </li>
              <li
                class="el-dropdown-menu__item"
                @click.prevent="deleteTeamFolder(selectedFolder)"
              >
                <span class="text-danger">{{ $t('common.delete') }}</span>
              </li>
            </template>
          </component>
        </client-only>
      </div> -->
      <!-- List Shared folders end -->

      <!-- List Ciphers -->
      <client-only v-if="!viewFolder">
        <!-- <div v-if="getRouteBaseName() === 'vault'" class="flex justify-between">
          <div
            class="mb font-medium"
          >
            {{ $t('data.ciphers.all_items') }}
          </div>
          <button class="px-4 py-2 flex items-center cursor-pointer btn-default rounded justify-center font-semibold" @click="chooseCipherType">
            <i class="el-icon-circle-plus-outline text-lg" />
            <div class="ml-3 break-all">Add new</div>
          </button>
        </div> -->
        <!-- <el-table
          ref="multipleTable"
          :data="ciphers || []"
          style="width: 100%"
          row-class-name="hover-table-row"
          lazy
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label=""
            min-width="300"
            show-overflow-tooltip
          >
            <template slot="header">
              <div v-if="multipleSelection.length" class="flex items-center ">
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
                <div v-else class="">
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
            </template>
            <template slot-scope="scope">
              <div class="flex items-center">
                <div
                  class="text-[34px] mr-3 flex-shrink-0"
                  :class="{'filter grayscale': scope.row.isDeleted}"
                >
                  <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                </div>
                <div class="flex flex-col">
                  <a
                    class="text-black font-semibold truncate flex items-center"
                    :class="{'opacity-80': scope.row.isDeleted}"
                    @click="routerCipher(scope.row, addEdit)"
                  >
                    {{ scope.row.name }}
                    <img v-if="scope.row.organizationId" src="~/assets/images/icons/shares.svg" alt="Shared" :title="$t('common.shared_with_you')" class="inline-block ml-2">
                  </a>
                  <div>
                    {{ scope.row.subTitle }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            :label="$t('data.ciphers.updated_time')"
          >
            <template slot-scope="scope">
              <span class="break-normal">{{ $moment(scope.row.revisionDate).fromNow() }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            :label="$t('common.actions')"
          >
            <template slot-scope="scope">
              <div class="col-actions">
                <button
                  v-if="!scope.row.isDeleted && scope.row.login.canLaunch"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.go_to_website')"
                  @click="openNewTab(scope.row.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <el-dropdown
                  v-if="!scope.row.isDeleted"
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="far fa-clone" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="scope.row.type === CipherType.Login">
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.login.username"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.username') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.login.password"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('common.copy') }} {{ $t('common.password') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="scope.row.type === CipherType.SecureNote">
                      <el-dropdown-item
                        v-clipboard:copy="scope.row.notes"
                        v-clipboard:success="clipboardSuccessHandler"
                        divided
                      >
                        {{ $t('common.copy') }} {{ $t('common.note') }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <button
                  v-if="!scope.row.isDeleted && canShareItem(organizations, scope.row)"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.share')"
                  @click="shareItem(scope.row)"
                >
                  <i class="far fa-share-square" />
                </button>
                <el-dropdown trigger="click" :hide-on-click="false">
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="!scope.row.isDeleted && canManageItem(organizations, scope.row)">
                      <el-dropdown-item @click.native="addEdit(scope.row)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item divided @click.native="cloneCipher(scope.row)">
                        {{ $t('common.clone') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="!scope.row.isDeleted">
                      <el-dropdown-item @click.native="moveFolders([scope.row.id])">
                        {{ $t('common.move_folder') }}
                      </el-dropdown-item>
                      <el-dropdown-item divided @click.native="moveTrashCiphers([scope.row.id])">
                        <span class="text-danger">{{ $t('common.delete') }}</span>
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item divided @click.native="restoreCiphers([scope.row.id])">
                        {{ $t('common.restore') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteCiphers([scope.row.id])">
                        <span class="text-danger">{{ $t('common.permanently_delete') }}</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table> -->
        <RecycleScroller
          ref="list"
          page-mode
          :item-size="65"
          :items="ciphers || []"
        >
          <template slot="before">
            <div class="th">
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
            <div
              v-for="header in headers"
              :key="header"
              class="th"
            >
              {{ header }}
            </div>
          </template>
          <template #default="{item}">
            <div class="td">
              <div class="flex items-center">
                <div class="mr-4">
                  <el-checkbox
                    :value="item.checked?true:false"
                    @change="changeSelection(item)"
                  />
                </div>
                <div
                  class="text-[34px] mr-3 flex-shrink-0"
                  :class="{'filter grayscale': item.isDeleted}"
                >
                  <Vnodes :vnodes="getIconCipher(item, 34)" />
                </div>
                <div class="flex flex-col">
                  <a
                    class="text-black font-semibold truncate flex items-center"
                    :class="{'opacity-80': item.isDeleted}"
                    @click="routerCipher(item, addEdit)"
                  >
                    {{ item.name }}
                    <img
                      v-if="item.organizationId"
                      src="~/assets/images/icons/shares.svg"
                      alt="Shared"
                      :title="$t('common.shared_with_you')"
                      class="inline-block ml-2"
                    >
                  </a>
                  <div>
                    {{ item.subTitle }}
                  </div>
                </div>
              </div>
            </div>
            <div class="td">
              <span class="break-normal">{{ $moment(item.revisionDate).fromNow() }}</span>
            </div>
            <div class="td">
              <div class="col-actions text-right">
                <button
                  v-if="!item.isDeleted && item.login.canLaunch"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.go_to_website')"
                  @click="openNewTab(item.login.uri)"
                >
                  <i class="fas fa-external-link-square-alt" />
                </button>
                <el-dropdown
                  v-if="!item.isDeleted"
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
                      >
                        {{ $t('common.copy') }} {{ $t('common.password') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="item.type === CipherType.SecureNote">
                      <el-dropdown-item
                        v-clipboard:copy="item.notes"
                        v-clipboard:success="clipboardSuccessHandler"
                        divided
                      >
                        {{ $t('common.copy') }} {{ $t('common.note') }}
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <button
                  v-if="!item.isDeleted && canShareItem(organizations, item)"
                  class="btn btn-icon btn-xs hover:bg-black-400"
                  :title="$t('common.share')"
                  @click="shareItem(item)"
                >
                  <i class="far fa-share-square" />
                </button>
                <el-dropdown
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="!item.isDeleted && canManageItem(organizations, item)">
                      <el-dropdown-item @click.native="addEdit(item)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        @click.native="cloneCipher(item)"
                      >
                        {{ $t('common.clone') }}
                      </el-dropdown-item>
                    </template>
                    <template v-if="!item.isDeleted">
                      <el-dropdown-item @click.native="moveFolders([item.id])">
                        {{ $t('common.move_folder') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        @click.native="moveTrashCiphers([item.id])"
                      >
                        <span class="text-danger">{{ $t('common.delete') }}</span>
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item
                        divided
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
              </div>
            </div>
          </template>
        </RecycleScroller>
      </client-only>
      <!-- List Ciphers end -->
    </div>
    <NoCipher
      v-else-if="!$store.state.syncing"
      :type="type"
      @add-cipher="handleAddButton"
    />
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
    <!-- <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="ciphers || []"
      :item-size="30"
      key-field="id"
      page-mode
    >
      <div class="user">
        {{ item.name }}
      </div>
    </RecycleScroller> -->
  </div>
</template>

<script>
import * as lunr from 'lunr'
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
import { CipherType } from '../../jslib/src/enums'
import Vnodes from '../../components/Vnodes'
import ChooseCipherType from '../../components/cipher/ChooseCipherType'
import PremiumDialog from '../../components/upgrade/PremiumDialog.vue'
CipherType.CryptoAccount = 6
CipherType.CryptoWallet = 7
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
      orderField: 'name', // revisionDate
      orderDirection: 'asc',
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
      // options: ['Login', 'SecureNote', 'Card', 'Identity', 'Folder'],
      selectedType: 'Login',
      viewFolder: false,
      showLogo: this.$cookies.get('show-logo') || false,
      headers: ['Updated time', 'Actions'],
      folders: [],
      collections: [],
      decryptIndex: 0,
      decrypting: true,
      decryptedCiphers: []
    }
  },
  computed: {
    options () {
      return [
        {
          label: 'Password',
          value: 'Login'
        },
        {
          label: 'SecureNote',
          value: 'SecureNote'
        },
        {
          label: 'Card',
          value: 'Card'
        },
        {
          label: 'Identity',
          value: 'Identity'
        },
        // {
        //   label: 'Crypto Assets',
        //   value: 'CryptoAccount'
        // },
        {
          label: 'Folder',
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
        return find(this.collections, e => e.id === this.$route.params.tfolderId) || { name: 'Unassigned Folder' }
      }
      return {}
    },
    filteredCollection () {
      return groupBy(this.collections, 'organizationId')
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
    }
  },
  // updated () {
  //   this.loading = false
  // },
  watch: {
    ciphers () {
      if (this.ciphers) {
        this.loading = false
      }
    }
  },
  async mounted () {
    this.context = 'VueContext'
    // window.onscroll = async () => {
    //   const bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + 500 >= document.documentElement.scrollHeight

    //   if (bottomOfWindow) {
    //     // if (this.renderIndex <= this.ciphers.length) {
    //     //   this.dataRendered = this.dataRendered.concat(this.ciphers.slice(this.renderIndex, this.renderIndex + 50))
    //     // }
    //     // this.renderIndex += 50
    //     if (this.decryptIndex < this.cipherCount) {
    //       let decryptedCiphers = await this.$myCipherService.getDecryptedCiphers(this.decryptIndex) || []
    //       decryptedCiphers = decryptedCiphers.concat(this.allCiphers)
    //       console.log('concat: ', decryptedCiphers.length)
    //       this.allCiphers = decryptedCiphers
    //     }
    //     this.decryptIndex += 100
    //   }
    // }
  },
  asyncComputed: {
    // allCiphers: {
    //   async get () {
    //     console.log('get all')
    //     const startTime = Date.now()
    //     let result = await this.$myCipherService.getDecryptedCiphers(0) || []
    //     this.decryptIndex += 100
    //     // let result = await this.$cipherService.getAllDecrypted() || []

    //     const endTime = Date.now()
    //     const timeDiff = endTime - startTime // in ms
    //     // get seconds
    //     const seconds = Math.round(timeDiff)
    //     // console.log(seconds + ' seconds')
    //     console.log(result.length)

    //     // remove ciphers generated by authenticator
    //     result = result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity, CipherType.CryptoAccount, CipherType.CryptoWallet].includes(cipher.type))
    //     return result
    //     // return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
    //   },
    //   set (newValue) {
    //     const result = newValue
    //     return result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity, CipherType.CryptoAccount, CipherType.CryptoWallet].includes(cipher.type))
    //   },
    //   watch: ['$store.state.syncedCiphersToggle']
    // },
    // ciphers: {
    //   async get () {
    //     console.log('search ciphers')
    //     const deletedFilter = c => {
    //       return c.isDeleted === this.deleted
    //     }
    //     if (this.allCiphers) {
    //       const startTime = Date.now()
    //       const result = await this.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
    //       // const result = this.allCiphers.filter(deletedFilter)
    //       const endTime = Date.now()
    //       const timeDiff = endTime - startTime // in ms
    //       // strip the ms

    //       // get seconds
    //       const seconds = Math.round(timeDiff)
    //       // console.log(seconds + ' seconds')
    //       this.dataRendered = result.slice(0, 30)
    //       this.renderIndex = 30
    //       return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
    //     }
    //     return []
    //   },
    //   watch: ['allCiphers', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    // },
    ciphers: {
      async get () {
        // this.loading = true
        const startTime = Date.now()
        const deletedFilter = c => {
          return c.isDeleted === this.deleted
        }
        console.log('search ciphers')
        let result = await this.$mySearchService.searchCiphers(this.searchText, [this.filter, deletedFilter], null) || []
        console.log(result.length)
        // remove ciphers generated by authenticator
        result = result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity, CipherType.CryptoAccount].includes(cipher.type))
        result.map(item => {
          return {
            ...item,
            checked: false
          }
        })
        const endTime = Date.now()
        const timeDiff = endTime - startTime // in ms
        // get seconds
        const seconds = Math.round(timeDiff)
        console.log(seconds + ' seconds')
        // this.loading = false
        // this.dataRendered = result.slice(0, 30)
        // this.renderIndex = 30
        return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
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
        let folders = await this.$folderService.getAllDecrypted() || []
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.folderId === f.id) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
        // const userId = await this.$userService.getUserId()
        // const ciphers = window.localStorage.getItem('ciphers_' + userId)
        // if (ciphers) {
        //   this.loading = false
        // }
        return folders
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    }
    // weakPasswordScores: {
    //   async get () {
    //     const weakPasswordScores = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    //     if (this.getRouteBaseName() === 'vault') {
    //       const allCiphers = await this.$cipherService.getAllDecrypted()
    //       // const allCiphers = this.allCiphers || []
    //       const isUserNameNotEmpty = c => {
    //         return c.login.username != null && c.login.username.trim() !== ''
    //       }
    //       allCiphers.forEach(c => {
    //         if (c.type !== CipherType.Login || c.login.password == null || c.login.password === '' || c.isDeleted || c.organizationId) {
    //           return
    //         }
    //         const hasUserName = isUserNameNotEmpty(c)
    //         let userInput = []
    //         if (hasUserName) {
    //           const atPosition = c.login.username.indexOf('@')
    //           if (atPosition > -1) {
    //             userInput = userInput.concat(
    //               c.login.username.substr(0, atPosition).trim().toLowerCase().split(/[^A-Za-z0-9]/))
    //               .filter(i => i.length >= 3)
    //           } else {
    //             userInput = c.login.username.trim().toLowerCase().split(/[^A-Za-z0-9]/)
    //               .filter(i => i.length >= 3)
    //           }
    //         }
    //         const result = this.$passwordGenerationService.passwordStrength(c.login.password,
    //           userInput.length > 0 ? userInput : null)
    //         weakPasswordScores[result.score]++
    //       })
    //       await this.$axios.$put('/cystack_platform/pm/users/me', {
    //         scores: weakPasswordScores
    //       })
    //     }
    //     return weakPasswordScores
    //   },
    //   // watch: ['allCiphers']
    //   watch: ['$store.state.syncedCiphersToggle']
    // }
    // collections: {
    //   async get () {
    //     if (this.$store.state.syncing) {
    //       console.log('get collection return')
    //       return
    //     }
    //     console.log('get collections')
    //     let collections = await this.$collectionService.getAllDecrypted() || []
    //     collections = collections.filter(f => f.id)
    //     collections.forEach(f => {
    //       const ciphers = this.ciphers && (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
    //       f.ciphersCount = ciphers && ciphers.length
    //     })
    //     if (!this.$store.state.syncing) {
    //       this.loading = false
    //     }
    //     return collections
    //   },
    //   watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    // }
  },
  methods: {
    async iteratorDecryptCiphers () {
      console.log('iterator decrypt ciphers')
      const startTime = Date.now()
      let index = 0
      let result = []
      while (index < this.cipherCount) {
        const ciphers = await this.$myCipherService.getDecryptedCiphers(index) || []
        result = result.concat(ciphers)
        index += 100
      }
      this.decrypting = false
      const endTime = Date.now()
      const timeDiff = endTime - startTime // in ms
      // strip the ms

      // get seconds
      const seconds = Math.round(timeDiff)
      console.log(seconds + ' seconds')
      this.decryptedCiphers = result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity, CipherType.CryptoAccount, CipherType.CryptoWallet].includes(cipher.type))
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
      console.log(this.selectedFolder)
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
    isBiz (team) {
      return team.is_business
    },
    async searchCiphers (query = '', filter, ciphers) {
      const results = []
      if (query != null) {
        query = query.trim().toLowerCase()
      }
      if (query === '') {
        query = null
      }
      if (ciphers == null) {
        ciphers = this.allCiphers
      }
      if (filter != null && Array.isArray(filter) && filter.length > 0) {
        ciphers = ciphers.filter(c => filter.every(f => f == null || f(c)))
      } else if (filter != null) {
        ciphers = ciphers.filter(filter)
      }
      if (!this.isSearchable(query)) {
        return ciphers
      }

      if (this.indexing) {
        await new Promise(r => setTimeout(r, 250))
        if (this.indexing) {
          await new Promise(r => setTimeout(r, 500))
        }
      }

      const index = this.getIndexForSearch()
      if (index === null) {
        // Fall back to basic search if index is not available
        return this.searchCiphersBasic(ciphers, query)
      }
      const ciphersMap = new Map()
      ciphers.forEach(c => ciphersMap.set(c.id, c))

      let searchResults = null
      const isQueryString = query != null && query.length > 1 && query.indexOf('>') === 0
      if (isQueryString) {
        try {
          searchResults = index.search(query.substr(1).trim())
        } catch { }
      } else {
        // tslint:disable-next-line
        const soWild = lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
        searchResults = index.query(q => {
          lunr.tokenizer(query).forEach(token => {
            const t = token.toString()
            q.term(t, { fields: ['name'], wildcard: soWild })
            q.term(t, { fields: ['subtitle'], wildcard: soWild })
            q.term(t, { fields: ['login.uris'], wildcard: soWild })
            q.term(t, {})
          })
        })
      }

      if (searchResults != null) {
        searchResults.forEach(r => {
          if (ciphersMap.has(r.ref)) {
            results.push(ciphersMap.get(r.ref))
          }
        })
      }
      return results
    },
    isSearchable (query) {
      const notSearchable = query == null || (this.index == null && query.length < this.searchableMinLength) ||
        (this.index != null && query.length < this.searchableMinLength && query.indexOf('>') !== 0)
      return !notSearchable
    },
    getIndexForSearch () {
      return this.index
    },
    searchCiphersBasic (ciphers, query, deleted = false) {
      query = query.trim().toLowerCase()
      return ciphers.filter(c => {
        if (deleted !== c.isDeleted) {
          return false
        }
        if (c.name != null && c.name.toLowerCase().includes(query)) {
          return true
        }
        if (query.length >= 8 && c.id.startsWith(query)) {
          return true
        }
        if (c.subTitle != null && c.subTitle.toLowerCase().includes(query)) {
          return true
        }
        if (c.login && c.login.uri != null && c.login.uri.toLowerCase().includes(query)) {
          return true
        }
        return false
      })
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
    changeShowLogo (value) {
      this.$cookies.set('show-logo', value)
    },
    async demoAsyncCall () {
      // const userId = await this.$userService.getUserId()
      // const ciphers = await this.$storageService.get('ciphers_' + userId)
      return new Promise(resolve => setTimeout(() => resolve(), 5000))
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
  flex: 2;
}
.th:last-child {
  text-align: right;
}
</style>
