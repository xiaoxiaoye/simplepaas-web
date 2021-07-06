<template>
  <el-container direction="vertical">
    <el-main height="">
      <el-form ref="form" :model="form" label-width="100px" label-position="left">
        <el-collapse>
          <el-collapse-item title="基本信息" name="1">
            <el-form-item label="应用名称" class="input-item">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" class="input-item">
              <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="镜像" name="2">
            <el-row>
              <el-col :span="8">
                <el-form-item label="镜像">
                  <el-select v-model="form.image" placeholder="请选择镜像" class="form-select">
                    <el-option v-for="image in imageList" :label="image" :value="repository.address.substring(7)+'/'+image" :key="image"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="镜像拉取策略">
                  <el-select v-model="form.pullPolicy" placeholder="请选择拉取策略" class="form-select">
                    <el-option label="从不拉取" value="Never"></el-option>
                    <el-option label="本地不存在才拉取" value="IfNotPresent"></el-option>
                    <el-option label="每次都拉取" value="Always"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="启动命令" class="input-item">
                <el-input type="textarea" :rows="3" v-model="form.command"></el-input>
              </el-form-item>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="部署" name="3">
            <el-row>
              <el-col :span="8">
                <el-form-item label="模式">
                  <el-select v-model="form.deployMode" placeholder="请选择" class="form-select">
                    <el-option label="Pod" value="pod"></el-option>
                    <!-- <el-option label="DeamonSet" value="deamonSet"></el-option>
                    <el-option label="Deployment" value="deployment"></el-option>
                    <el-option label="Job" value="job"></el-option> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="目标实例数">
                  <el-input-number :min="1" v-model="form.target" class="form-num"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <!-- <el-collapse-item title="运维特性" name="4">
            <el-row>
              <el-col :span="24">
                <el-card shadow="always" :body-style="{ padding: '20px' }">
                  <div slot="header">
                    <span>伸缩</span>
                  </div>
                  <el-form-item label="最小实例数">
                    <el-input-number
                      v-model="form.trait_scale_min"
                      class="form-num"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="最大实例数">
                    <el-input-number
                      v-model="form.trait_scale_max"
                      class="form-num"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="伸缩维度">
                    <el-select
                      v-model="form.trait_scale_metric"
                      placeholder="请选择"
                      class="form-select"
                    >
                      <el-option label="Pod" value="Pod"></el-option>
                      <el-option label="CPU" value="CPU"></el-option>
                      <el-option label="内存" value="Memory"></el-option>
                    </el-select>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-card shadow="always" :body-style="{ padding: '20px' }">
                  <div slot="header">
                    <span>健康检查</span>
                  </div>
                  <el-form-item label="方式">
                    <el-select
                      v-model="form.trait_health_check_type"
                      placeholder="请选择"
                      class="form-select"
                    >
                      <el-option label="命令行" value="cmd"></el-option>
                      <el-option label="Http" value="http"></el-option>
                      <el-option label="TCP" value="tcp"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="检查命令" class="input-item">
                    <el-input v-model="form.trait_health_check_cmd"></el-input>
                  </el-form-item>
                  <el-form-item label="间隔" class="input-item">
                    <template>
                      <el-input
                      v-model="form.trait_health_check_interval"
                      class="form-num"
                    ></el-input>
                    <span>秒</span>
                    </template>
                    
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item> -->
        </el-collapse>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        image: '',
        pullPolicy: '',
        command: '',
        deployMode: '',
        target: 0,
      },
      imageList: [],
      repository: {
        address: '',
        health: '',
        diskSize: 10,
        count: 0,
      }
    }
  },
  props: ['appId'],
  mounted() {
    if (this.appId != null) {
      let _this = this
      this.getRequest('/application/' + this.appId).then(function(app) {
        _this.form.id = app.id
        _this.form.name = app.name
        _this.form.description = app.description
        _this.form.image = app.image
        _this.form.pullPolicy = app.pullPolicy
        _this.form.command = app.command
        _this.form.deployMode = app.deployMode
        _this.form.target = app.target
      })
    }
    this.listImages()
    this.repositoryStatus()
  },
  methods: {
    onSubmit() {
      this.$confirm('是否保存应用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.postRequest('/application', this.form)
          this.$message({
            type: 'success',
            message: '创建成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
        .finally(() => {
          this.$router.replace('/viewApps')
        })
    },
    onCancel() {
      this.$confirm('是否取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).finally(() => {
        this.$router.replace('/viewApps')
      })
    },

    listImages() {
      let _this = this
      this.getRequest('/repository/images').then(function(response) {
        _this.loading = false
        _this.imageList = []
        response.forEach((image) => {
          _this.imageList.push(image.name + ':' + image.version)
        })
      })
    },
    repositoryStatus() {
      let _this = this
      this.getRequest('/repository/info').then(function(status) {
        _this.repository.address = status.address
        _this.repository.health = status.isHealth ? '正常' : '异常'
        _this.repository.diskSize = status.diskSize
        _this.repository.count = status.count
      })
    },
  },
}
</script>

<style>
.input-item {
  width: 400px;
}

.form-select {
  float: left;
}
.form-num {
  float: left;
}
</style>
