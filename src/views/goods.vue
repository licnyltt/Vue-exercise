<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success" plain @click="goodsAdd">添加商品</el-button>
    <el-table ref="Goodstable" stripe :data="GoodsData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="120"></el-table-column>
      <el-table-column property="goods_price" label="商品价格" width="120"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量" width="120"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{row}">{{row.add_time | timefilter}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-row>
            <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
import moment from "moment";
export default {
  filters: {
    timefilter(v) {
      return moment(v).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  data() {
    return {
      total: 0,
      pagesize: 5,
      currentpage: 1,
      GoodsData: []
    };
  },
  methods: {
    async getGoodsList() {
      let {
        data: { data, meta }
      } = await this.$http({
        url: "goods",
        params: {
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      console.log(data, meta, "goods");
      this.GoodsData = data.goods;
      this.total = data.total;
    },
    changePage(page) {
      this.currentpage = page;
      this.getGoodsList();
    },
    goodsAdd() {
      this.$router.push("/goods-add");
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>


