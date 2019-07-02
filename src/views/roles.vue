<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="120"></el-table-column>
      <el-table-column property="path" label="路径" width="120"></el-table-column>
      <el-table-column property="level" label="层级">
        <template v-slot="{row}">
          <span>{{row.level | levelfilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentRow: null
    };
  },

  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  },
  filters: {
    levelfilter(v) {
      switch (v) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  },
  async created() {
    try {
      let {
        data: { data, meta }
      } = await this.$http({
        url: "rights/list"
      });
      console.log(data, meta);
      this.tableData = data;
    } catch (err) {}
  }
};
</script>
