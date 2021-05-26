<template>
  <div class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <client-only>
        <el-table
          :data="groups"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            label="Members"
            align="right"
          >
            <template slot-scope="scope">
              0
            </template>
          </el-table-column>
          <el-table-column
            align="right"
          >
            <template slot-scope="scope">
              <el-dropdown trigger="click" :hide-on-click="false">
                <button class="btn btn-icon btn-xs hover:bg-black-400">
                  <i class="fas fa-ellipsis-h" />
                </button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="putGroup(scope.row)"
                  >
                    {{ $t('common.edit') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="putGroupUsers(scope.row)"
                  >
                    {{ $t('common.users') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="deleteGroup(scope.row)">
                    <span class="text-danger">
                      {{ $t('common.remove') }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
    <AddEditGroup ref="addEditGroup" @done="getGroups" />
    <AddEditGroupUsers ref="addEditGroupUsers" @done="getGroups" />
    <div class="fixed bottom-[50px] right-[55px]">
      <button class="btn btn-fab rounded-full flex items-center justify-center"
              @click="postGroup({})"
      >
        <i class="fas fa-plus text-[24px]" />
      </button>
    </div>
  </div>
</template>

<script>
import AddEditGroup from '../../../components/groups/AddEditGroup'
import AddEditGroupUsers from '../../../components/groups/AddEditGroupUsers'
export default {
  components: {
    AddEditGroup, AddEditGroupUsers
  },
  data () {
    return {
      groups: []
    }
  },
  mounted () {
    this.getGroups()
  },
  methods: {
    postGroup () {
      this.$refs.addEditGroup.openDialog({})
    },
    getGroups () {
      this.$axios.$get(`cystack_platform/pm/teams/${this.$route.params.teamId}/groups`)
        .then(res => {
          this.groups = res
        })
    },
    putGroup (group) {
      this.$refs.addEditGroup.openDialog(group)
    },
    putGroupUsers (group) {
      this.$refs.addEditGroupUsers.openDialog(group)
    },
    deleteGroup (group) {
      this.$refs.addEditGroup.deleteUser(group)
    }
  }
}
</script>
