<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table ref="roleTable" :data="getRoleListData" stripe style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row type="flex" v-for="level1 in row.children" :key="level1.id" class="level1">
              <el-col :span="6">
                <el-tag closable @close="delRights(row, level1.id)">{{level1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col>
                <el-row type="flex" v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      class="level2"
                      @close="delRights(row, level2.id)"
                    >{{level2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col>
                    <el-tag
                      @close="delRights(row, level3.id)"
                      class="level3"
                      closable
                      type="warning"
                      v-for="level3 in level2.children"
                      :key="level3.id"
                    >{{level3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-row>
            <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
            <el-button
              type="success"
              plain
              size="mini"
              icon="el-icon-check"
              @click="assignRights(row)"
            >分配权限</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的模态框 -->
    <el-dialog title="角色授权" :visible.sync="roleAssignRightsDialog">
      <!-- <el-tree
        ref="rightsTree"
        :data="roleAssignRightsData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        default-expand-all
      ></el-tree>-->
      <el-tree
        ref="rightsTree"
        :data="roleAssignRightsData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAssignRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRightsConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // arr: [],
      // checkedRights: [],
      roleAssignRightsDialog: false,
      currentEditRoleId: -1,
      getRoleListData: [],
      roleAssignRightsData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    async getRoleList(t = () => {}) {
      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: "roles"
        });
        console.log(data, meta);
        if (meta.status == 200) {
          this.getRoleListData = data;
          t();
        }
      } catch (err) {}
    },
    async assignRights(row) {
      try {
        this.currentEditRoleId = row.id;
        this.roleAssignRightsDialog = true;
        let {
          data: { data, meta }
        } = await this.$http({
          url: "rights/tree"
        });
        this.roleAssignRightsData = data;
        let level1Ids = [];
        let level2Ids = [];
        let level3Ids = [];
        row.children.forEach(level1 => {
          level1Ids.push(level1.id);
          level1.children.forEach(level2 => {
            level2Ids.push(level2.id);
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id);
            });
          });
        });
        // this.checkedRights = [...level1Ids, ...level2Ids, ...level3Ids];
        this.$refs.rightsTree.setCheckedKeys(level3Ids);
      } catch (err) {}
    },
    async addRightsConfirm() {
      console.log(999999);

      try {
        let rids = [
          //有bug
          ...this.$refs.rightsTree.getCheckedKeys(),
          ...this.$refs.rightsTree.getHalfCheckedKeys()
        ].join(",");
        console.log("rids = ", rids);

        // let rids = this.arr.join();
        let {
          data: { data, meta }
        } = await this.$http({
          url: `roles/${this.currentEditRoleId}/rights`,
          method: "post",
          data: { rids: rids }
        });
        this.$message({
          type: "success",
          message: meta.msg,
          duration: 1000
        });
        this.roleAssignRightsDialog = false;
        this.getRoleList();
      } catch (err) {}
    },
    async delRights(row, id) {
      let level1Ids = [];
      let level2Ids = [];
      let level3Ids = [];
      row.children.forEach(level1 => {
        level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      let result = [...level1Ids, ...level2Ids, ...level3Ids];
      console.log(result);
      // this.arr = result;

      let rids = result.filter(v => v != id).join();
      console.log(rids);

      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: `roles/${row.id}/rights`,
          method: "post",
          data: { rids: rids }
        });
        console.log(data, meta, 111111111111111111);

        // if (meta.status == 200) {
        this.$message({
          type: "success",
          message: meta.msg,
          duration: 1000
        });
        // try {
        //   let {
        //     data: { data, meta }
        //   } = await this.$http({
        //     url: "roles"
        //   });
        //   console.log(data, meta);

        //   if (meta.status == 200) {
        //     this.getRoleListData = data;
        //     t();
        //   }

        // } catch (err) {}
        this.getRoleList(() => {
          console.log(111);

          this.$nextTick(() => {
            console.log(22);

            this.$refs.roleTable.toggleRowExpansion(
              this.getRoleListData.find(v => v.id == row.id),
              true
            );
          });
        });

        // this.getRoleList(() => {
        //   this.$nextTick(() => {
        //     this.$refs.roleTable.toggleRowExpansion(
        //       this.getRoleListData.find(v => v.id === row.id),
        //       true
        //     );
        //   });
        // });
        // }
      } catch (err) {}
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>
<style scoped>
.level1 {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 30px;
  margin-top: 10px;
}
.level2 {
  margin-bottom: 20px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>


