<template>
    <!-- el-row 这个组件就相当于是一个div，这个组件是用来做布局的 -->
    <!-- type 是布局模式，可以是flex -->
    <!-- justify 是用来设置水平对齐的方式的 -->
    <el-row type="flex" class="row-bg" justify="center" align="middle">
        <!-- el-col 布局组件 列组件 -->
        <!-- span 属性是用来设置当前列所占的格数的 -->
        <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
            <el-form ref="form" :model="form" class="login-form" label-position="top" label-width="80px">
                <el-form-item label="用户名">
                    <el-input></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
export default {
data() {
    return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
};
</script>

<style>
  .row-bg{
    height: 100%;
    background-color: #2D434C;
  }
  .login-form{
    background-color: #fff;
    border-radius: 10px;
    padding: 30px 20px;
    min-width: 400px;
  }
</style>
