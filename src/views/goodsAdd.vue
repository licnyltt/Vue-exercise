<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="activeIndex" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="replace">
      <el-tab-pane label="基本信息" name="base">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <el-cascader v-model="form.cat_Arr" :options="goodsOptions" :props="propObj"></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio label="1" v-model="form.is_promote">是</el-radio>
            <el-radio label="0" v-model="form.is_promote">否</el-radio>
          </el-form-item>
          <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-remove="handleRemove"
          :on-success="onUploadSuccess"
          list-type="picture-card"
          :headers="headers"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoodsConfirm">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      propObj: {
        label: "cat_name",
        value: "cat_id"
      },
      activeName: "base",
      activeIndex: 0,
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        is_promote: "0",
        cat_Arr: [],
        pics: [],
        goods_introduce: ""
      },
      goodsOptions: []
    };
  },
  methods: {
    async getGoodsList() {
      let {
        data: { data, meta }
      } = await this.$http({
        url: "categories",
        params: {
          type: 3
        }
      });
      console.log(data, meta, "addShops");
      this.goodsOptions = data;
    },
    next(index, activeName) {
      console.log(activeName);
      this.activeName = activeName;
      this.activeIndex = index;
    },
    replace(v) {
      console.log(v);
      this.activeIndex = +v.index;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    onUploadSuccess({ data, meta }) {
      console.log(data);
      this.form.pics.push({
        pic: data.tmp_path
      });
    },
    async addGoodsConfirm() {
      let newGoodsParams = {
        goods_name: this.form.goods_name,
        goods_price: this.form.goods_price,
        goods_number: this.form.goods_number,
        goods_weight: this.form.goods_weight,
        is_promote: this.form.is_promote,
        goods_cat: this.form.cat_Arr.join(),
        pics: this.form.pics,
        goods_introduce: this.form.goods_introduce
      };
      let {
        data: { data, meta }
      } = await this.$http({
        url: "goods",
        method: "post",
        data: newGoodsParams
      });
      console.log(data, meta, "confirm");
      if (meta.status == 201) {
        this.$router.push("/goods");
      }
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>
<style scoped>
.el-steps.el-steps--horizontal {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
<style>
.ql-container.ql-snow {
  height: 200px;
}
</style>


