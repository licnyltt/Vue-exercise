<template>
  <!-- el-row 这个组件就相当于是一个div，这个组件是用来做布局的 -->
  <!-- type 是布局模式，可以是flex -->
  <!-- justify 是用来设置水平对齐的方式的 -->
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <!-- el-col 布局组件 列组件 -->
    <!-- span 属性是用来设置当前列所占的格数的 -->
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="login-form"
        label-position="top"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password type="password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
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
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async submitForm(formName) {
      try {
        await this.$refs[formName].validate(async valid => {
          let {
            data: { data, meta }
          } = await this.$http({
            method: "post",
            url: "login",
            data: this.form
          });
          if (meta.status == 200) {
            localStorage.setItem("token", data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: meta.msg,
              duration: 1000
            });
          }
        });
      } catch (err) {
        console.log("表单验证或ajax请求失败");
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.login-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 20px;
  min-width: 400px;
}
</style>


