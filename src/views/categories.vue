<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addCategory">添加分类</el-button>
    <el-table :data="trees" ref="Categoriestable" stripe style="width: 100%">
      <el-table-tree-column
        file-icon="el-icon-document"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="50"
        level-key="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted ? "否" : "是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column prop="description" label="操作"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="changePage"
    ></el-pagination>

    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="addCategoryDialog">
      <el-form ref="refresh" :model="addCategoryParams">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="addCategoryParams.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" :label-width="formLabelWidth">
          <el-cascader
            v-model="addCategoryParams.cat_Arr"
            :options="options"
            :props="propObj"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const ElTreeGrid = require("element-tree-grid");
export default {
  data() {
    return {
      addCategoryParams: {
        cat_name: "",
        cat_Arr: []
      },
      propObj: {
        checkStrictly: true,
        value: "cat_id",
        label: "cat_name"
      },
      options: [],
      addCategoryDialog: false,
      total: 0,
      pagesize: 5,
      currentpage: 1,
      trees: [],
      formLabelWidth: "120px"
    };
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  methods: {
    async getCategoriesList() {
      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: "categories",
          params: {
            type: 3,
            pagenum: this.currentpage,
            pagesize: this.pagesize
          }
        });
        console.log(data, meta, "categories");
        this.trees = data.result;
        this.total = data.total;
      } catch (err) {}
    },
    changePage(page) {
      this.currentpage = page;
      this.getCategoriesList();
    },
    async addCategory() {
      this.addCategoryDialog = true;
      let {
        data: { data, meta }
      } = await this.$http({
        url: "categories",
        params: {
          type: 2,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      console.log(data, meta, "categories");
      this.options = data.result;
      this.total = data.total;
    },
    async addCategoryConfirm() {
      let cat_name = this.addCategoryParams.cat_name;
      let cat_level = this.addCategoryParams.cat_Arr.length;
      let cat_pid = this.addCategoryParams.cat_Arr.pop() || 0;
      let {
        data: { data, meta }
      } = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_pid,
          cat_level
        }
      });
      console.log(data, meta, "addCategory");
      if (meta.status == 201) {
        this.$message({
          type: "success",
          message: meta.msg,
          duratioin: 1000
        });
        this.addCategoryDialog = false;
        this.$refs.refresh.resetFields();
        this.getCategoriesList();
      }
    }
  },
  created() {
    this.getCategoriesList();
  }
};
</script>

