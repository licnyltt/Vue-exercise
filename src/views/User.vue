
<template>
  <keep-alive>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumbs">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="keywords"
            @keyup.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template v-slot="{row}">
            <!-- {{row}} -->
            <el-switch
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchOption(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-row>
              <el-button
                type="primary"
                plain
                size="mini"
                icon="el-icon-edit"
                @click="revision(row.id)"
              ></el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="del(row.id)"></el-button>
              <el-button
                type="success"
                plain
                size="mini"
                icon="el-icon-check"
                @click="assignRoleDialogShow(row)"
              >分配角色</el-button>
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
      <!-- 添加用户的模态框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="addform" :rules="rules">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off" show-password type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserConfirm('addform')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户的模态框 -->
      <el-dialog title="修改用户" :visible.sync="dialogFormVisibleRevision">
        <el-form :model="revisionform" ref="revisonform" :rules="revisionrules">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-button type="info" plain disabled size="small">{{revisionform.username}}</el-button>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="revisionform.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="revisionform.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRevision = false">取 消</el-button>
          <el-button type="primary" @click="revisionUserConfirm('revisonform')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色的模态框 -->
      <el-dialog title="分配角色" :visible.sync="assignRoleDialog">
        <el-form :model="assignform" ref="assignform">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-button type="info" plain disabled size="small">{{assignform.username}}</el-button>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <!-- <el-select v-model="assignform.rid" placeholder="请选择"> -->
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="assignRoleConfirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </keep-alive>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keywords: "",
      assignRoleDialog: false,
      dialogFormVisible: false,
      dialogFormVisibleRevision: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 5,
            max: 12,
            message: "用户名长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 18,
            message: "密码长度在 6 到 18 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "请输入正确的手机号码",
            trigger: "change"
          }
        ]
      },
      revisionform: {
        id: 0,
        email: "",
        mobile: "",
        username: ""
      },
      assignform: {
        rid: 0,
        id: 0,
        username: ""
      },
      value: "",
      options: [],
      formLabelWidth: "120px",
      revisionrules: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "请输入正确的手机号码",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
    getUserList() {
      this.$http({
        url: "users",
        params: {
          query: this.keywords,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      }).then(({ data: { data, meta } }) => {
        this.userList = data.users;
        this.total = data.total;
      });
    },
    async switchOption(user) {
      console.log(user);
      let {
        data: { data, meta }
      } = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put"
      });
      if (meta.status == 200) {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: "修改失败",
          type: "warning",
          duration: 1000
        });
        user.mg_state = !user.mg_state;
      }
    },
    changePage(page) {
      this.currentpage = page;
      this.getUserList();
    },
    search() {
      this.getUserList();
    },
    async del(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });

        if (meta.status == 200) {
          this.$message({
            message: "已成功删除",
            type: "success",
            duration: 1000
          });
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          message: "已取消删除",
          type: "info",
          duration: 1000
        });
      }
    },
    async addUserConfirm(formName) {
      try {
        await this.$refs[formName].validate();
        console.log("校验成功");
        // if (valider) {
        //   alert("submit!");
        // } else {
        //   console.log("error submit!!");
        //   return false;
        // }

        let {
          data: { data, meta }
        } = await this.$http({
          url: "users",
          method: "post",
          data: this.form
        });
        console.log(data, meta);

        if (meta.status == 201) {
          this.$message({
            message: meta.msg,
            type: "success",
            duration: 1000
          });
          // this.form.username = "";
          // this.form.password = "";
          // this.form.email = "";
          // this.form.mobile = "";
          this.$refs[formName].resetFields();
          this.getUserList();
          this.dialogFormVisible = false;
        } else {
          this.$message({
            message: meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        console.log("校验失败/发送ajax失败");
      }
    },
    async revision(id) {
      this.dialogFormVisibleRevision = true;
      let {
        data: { data, meta }
      } = await this.$http({
        url: `users/${id}`
      });
      this.revisionform.email = data.email;
      this.revisionform.mobile = data.mobile;
      this.revisionform.username = data.username;
      this.revisionform.id = data.id;
    },
    async revisionUserConfirm(formName) {
      try {
        await this.$refs[formName].validate();
        console.log("校验成功");
        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${this.revisionform.id}`,
          method: "put",
          data: this.revisionform
        });
        console.log(data, meta);

        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success",
            duration: 1000
          });
          this.revisionform.email = "";
          this.revisionform.mobile = "";
          this.getUserList();
          this.dialogFormVisibleRevision = false;
        } else {
          this.$message({
            message: meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        console.log("校验失败/发送ajax请求失败");
      }
    },
    async assignRoleConfirm() {
      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${this.assignform.id}/role`,
          method: "put",
          data: {
            rid: this.assignform.rid
          }
        });
        console.log(data, meta, 7777777777);
        this.$message({
          type: "success",
          message: meta.msg,
          duration: 1000
        });
        this.assignRoleDialog = false;
      } catch (err) {}
    },
    async assignRoleDialogShow(row) {
      try {
        this.assignRoleDialog = true;
        let {
          data: { data, meta }
        } = await this.$http({
          url: `users/${row.id}`
        });
        console.log(data, meta, 99999999999);

        this.assignform = data;
        let res = await this.$http({
          url: "roles"
        });
        console.log(res.data.data, 6666666666666666666666666666666);

        this.options = res.data.data;
      } catch (err) {}
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style>
.el-breadcrumb.bread-crumbs {
  padding-left: 15px;
  background-color: #d4dae0;
  height: 50px;
  line-height: 50px;
  font-size: 17px;
}
</style>


