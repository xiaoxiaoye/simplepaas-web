<template>
  <el-container class="app-wrapper">
    <el-header class="home-header">
      <span
        style="
          color: aliceblue;
          font-size: 25px;
          position: absolute;
          left: 20px;
          top: 20px;
        "
        >微平台</span
      >
      <el-dropdown style="position: absolute; right: 40px; top: 30px" @command="handleCommand">
        <span class="el-dropdown-link"> {{ current_user }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside style="width: 8%;height:100%">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="openMenu" router>
          <el-menu-item class="menu-item" index="/viewMetrics" key="1">
            <i class="el-icon-data-analysis"></i>
            <span slot="title">工作台</span>
          </el-menu-item>
          <el-menu-item class="menu-item" index="/viewApps" key="2">
            <i class="el-icon-menu"></i>
            <span slot="title">应用管理</span>
          </el-menu-item>
          <el-menu-item class="menu-item" index="/viewRegistry" key="3">
            <i class="el-icon-box"></i>
            <span slot="title">仓库镜像</span>
          </el-menu-item>
          <el-menu-item class="menu-item" index="/viewSysconfig" key="4">
            <i class="el-icon-setting"></i>
            <span slot="title">系统配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      openMenu: '/viewRegistry',
    }
  },
  computed: {
    current_user: function() {
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      if(user == null) {
          return ""
      }
      return user.username
    },
  },

  methods: {
    handleCommand(command) {
      console.log(command)
      if (command === 'logout') {
        this.getRequest('/logout')
        window.sessionStorage.removeItem('user')
        this.$router.replace('/')
      }
    },
  },
}
</script>

<style>
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
.app-wrapper:after {
    content: "";
    display: table;
    clear: both;
}

.el-menu-vertical-demo {
  /* width: 200px; */
  min-height: 800px;
  height: 100%;
}
.home-header {
  background-color: #409eff;
  opacity: 0.9;
  width: 100%;
  /* text-align: left; */
  /* color: aliceblue; */
  /* font-size:25px; */
  /* font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif; */
}

</style>
