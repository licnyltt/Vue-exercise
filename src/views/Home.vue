<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1 class="mar">后台管理系统</h1>
        </el-col>
        <el-col :span="6" class="header-right">
          <span>欢迎39期星耀会员</span>
          <a href="#" @click.prevent="logout">退出</a>
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          unique-opened
          router
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + '' ">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="'/' + item2.path">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { async } from "q";
export default {
  data() {
    return {
      menuList: []
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },
  async created() {
    let {
      data: { data, meta }
    } = await this.$http({
      url: "menus"
    });
    console.log(data, meta, "home");
    this.menuList = data;
  }
};
</script>

<style>
.el-container {
  height: 100%;
}
.el-container .el-header {
  background-color: #b3c0d1;
  padding: 0;
  margin: 0;
}
.el-container .el-header img {
  width: 200px;
}

.el-header .row-bg {
  background-color: #b3c0d1;
}

.el-header .row-bg h1 {
  text-align: center;
  color: #fff;
  font-size: 28px;
}

.el-header .row-bg .header-right {
  text-align: right;
  padding-right: 10px;
}

.el-header .row-bg .header-right span {
  font-weight: 700;
}

.el-header .row-bg .header-right a {
  font-weight: 700;
  color: orange;
}

.el-aside {
  background-color: #545c64;
  height: 100%;
}

.el-aside ul {
  height: 100%;
}
.mar {
  margin: 0;
}
</style>


