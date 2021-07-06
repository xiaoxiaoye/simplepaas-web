<template>
  <el-container direction="vertical">
    <el-header height="">
      <el-row>
        <el-button-group style="float:left">
          <el-button type="primary" @click="publishApp">发布</el-button>
          <el-button type="primary" @click="offlineApp">下线</el-button>
          <el-button type="primary" @click="createApp">创建</el-button>
        </el-button-group>
        <el-button type="primary" style="float:right" @click="listApp">刷新</el-button>
      </el-row>
    </el-header>
    <el-container direction="horizontal">
      <el-main height="">
        <el-row>
          <el-table :data="applicationList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30"> </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="id" label-width="120px">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="名称" label-width="120px">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="镜像" label-width="120px">
                    <span>{{ props.row.image }}</span>
                  </el-form-item>
                  <el-form-item label="启动命令" label-width="120px">
                    <span>{{ props.row.command }}</span>
                  </el-form-item>
                  <el-form-item label="创建时间" label-width="120px">
                    <span>{{ props.row.create_time }}</span>
                  </el-form-item>
                  <el-form-item label="目标实例数" label-width="120px">
                    <span>{{ props.row.target }}</span>
                  </el-form-item>
                  <el-form-item label="实际实例数" label-width="120px">
                    <span>{{ props.row.ready }}</span>
                  </el-form-item>
                  <el-form-item label="已更新实例数" label-width="120px">
                    <span>{{ props.row.update }}</span>
                  </el-form-item>
                  <el-form-item label="可用实例数" label-width="120px">
                    <span>{{ props.row.available }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" width="140px"> </el-table-column>
            <el-table-column label="镜像" prop="image" width="140px"> </el-table-column>
            <el-table-column label="部署模式" prop="deployMode" width="140px"> </el-table-column>
            <el-table-column label="目标实例数" prop="target" width="100px"> </el-table-column>
            <el-table-column label="实际实例数" prop="ready" width="100px"> </el-table-column>
            <el-table-column label="可用实例数" prop="available" width="100px"> </el-table-column>
            <el-table-column label="创建时间" prop="create_time"></el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
              </template>
              <template slot-scope="scope">
                <el-button icon="el-icon-caret-right" size="mini" @click="openDialog(scope.row)"></el-button>
                <el-button icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <div style="float: left">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 50]"
              :page-size="currentPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            >
            </el-pagination>
          </div>
        </el-row>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
          <el-form ref="form" :model="dialogData" label-width="100px" label-position="left">
            <el-form-item label="实例数" class="input-item">
              <el-input-number v-model="dialogData.target"></el-input-number>
            </el-form-item>
            <el-form-item label="部署模式" class="input-item">
              <el-select v-model="dialogData.deployMode" placeholder="请选择" class="form-select">
                <el-option label="Pod" value="pod"></el-option>
                <el-option label="DeamonSet" value="deamonSet"></el-option>
                <el-option label="Deployment" value="deployment"></el-option>
                <el-option label="Job" value="job"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // applications: {},
      applicationList: [],
      search: '',
      currentPageSize: 10,
      currentPage: 1,
      totalNum: 0,
      multipleSelection: [],
      dialogVisible: false,
      dialogData: {
        target: 0,
        deployMode: 'pod',
      },
      appTimer: null
    }
  },

  computed: {
    // applicationList: function(){
    //   let apps = []

    //   for(let key in this.applications){
    //     apps.push(this.applications[key])
    //   }
    //   return apps
    // }
  },

  mounted() {
    this.listApp()
    // this.appTimer = setInterval(this.listApp, 5000)
  },
  destroyed(){
    if(this.appTimer){
      // clearInterval(this.appTimer)
    }
  },
  methods: {
    openDialog(app) {
      this.dialogVisible = true
      this.dialogData = app
    },
    submitDialog() {
      this.dialogVisible = false
      this.startApp(this.dialogData)
    },
    formatImageName(imageName) {
      let pos = imageName.indexOf('/')
      if (pos == -1) {
        return imageName
      }
      return imageName.substring(pos + 1)
    },
    formatDatetime(datetime) {
      if (!datetime) return datetime
      let time = new Date(datetime)
      return time.toLocaleString()
    },
    handleEdit(app) {
      this.$router.push('/viewAppsCreate?appId=' + app.id)
    },
    handleDelete(app) {
      this.$confirm('是否删除应用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteRequest('/application?appId=' + app.id)
          this.listApp()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    createApp() {
      this.$router.push('/viewAppsCreate')
    },
    listApp() {
      let _this = this
      this.getRequest('/application?pageNum='+this.currentPage+'&pageSize='+this.currentPageSize).then(function(resp) {
        _this.totalNum = resp.total
        _this.applicationList = []
        let applicationList = resp.list
        applicationList.forEach((application) => {
          let app = {
            id: application.id,
            name: application.name,
            command: application.command,
            image: _this.formatImageName(application.image),
            deployMode: application.deployMode,
            pullPolicy: application.pullPolicy,
            target: 0,
            ready: 0,
            available: 0,
            update: 0,
            create_time: _this.formatDatetime(application.createTime),
          }
          let status = application.applicationStatus
          if (status){
            app.ready = status.readyNum ? status.readyNum :  0
            app.target = status.targetNum ? status.targetNum:0
            app.available = status.availableNum ? status.availableNum:0
            app.update = status.updateNum ? status.updateNum:0
          }
          _this.applicationList.push(app)
        })
      })
    },
    handleSizeChange(val) {
      this.currentPageSize = parseInt(val)
      this.listApp()
    },
    handleCurrentChange(val) {
      this.currentPage = parseInt(val)
      this.listApp()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    startApp(app) {
      this.postRequest('/application/publish/' + app.id + '?target=' + app.target)
    },
    publishApp() {
      if (this.multipleSelection.length <= 0) {
        return
      }
      this.$confirm('是否发布应用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let app = this.multipleSelection[i]
            this.startApp(app)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    offlineApp() {
      if (this.multipleSelection.length <= 0) {
        return
      }
      this.$confirm('是否下线应用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let app = this.multipleSelection[i]
            this.postRequest('/application/offline/' + app.id)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
  },
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
