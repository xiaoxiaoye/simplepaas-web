<template>
  <el-collapse v-model="activeNames" @change="handleChange" accordion>
    <el-collapse-item key="1" title="镜像仓库" name="1">
      <el-form :inline="true" ref="form" :model="form" label-width="40px" class="config-form">
        <el-form-item label="地址" style="float: left">
          <el-input v-model="form.registryUrl" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('registryUrl')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item key="2" title="K8S" name="2">
      <el-form :inline="true" ref="form" :model="form" label-width="80px" class="config-form">
        <el-form-item label="kubeconfig" style="float: left">
          <el-input :rows="20" type="textarea" v-model="form.kubeconfig" style="width: 700px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('kubeconfig')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      activeNames: [],
      form: {
        registryUrl: '',
        kubeconfig: '',
      },
    }
  },
  mounted() {
    let _this = this
    this.getRequest('/config/params/registry').then((response) => {
      _this.form.registryUrl = response
    })

    this.getRequest('/config/params/kubeconfig').then((response) => {
      _this.form.kubeconfig = response
    })
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },

    onSubmit(name) {
      let _this = this
      if (name === 'registryUrl') {
        this.postRequest('/config/params', {
          "paramCategory": "REGISTRY",
          "paramCode": "REGISTRY_URL",
          "paramName": "registry url",
          "paramValue": this.form.registryUrl
        }).then(() => {
          _this.$message.success("保存成功")
        })
      } else if (name === 'kubeconfig') {
        this.postRequest('/config/params', {
          "paramCategory": "KUBERNETES",
          "paramCode": "KUBERNETES_CONFIG",
          "paramName": "kubernetes config",
          "paramValue": this.form.kubeconfig
        }).then(() => {
          _this.$message.success("保存成功")
        })
      }
    },
  },
}
</script>

<style>
.config-form {
  width: 1000px;
}
</style>
