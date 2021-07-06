<template>
  <el-container direction="vertical">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="1" style="height: 100px">
            <el-image :src="login_url" fit="fill" lazy style="width: 60px; height: 60px; margin: auto; padding: 20px 0"></el-image>
          </el-col>
          <el-col :span="8" style="height: 100px">
            <div style="margin: auto; padding: 2px; text-align: left">
              <p style="font-size: 20px">你好 {{ user.username }}</p>
              <p>上次登录时间:{{ user.login_time }}</p>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container direction="horizontal">
      <el-container>
        <el-main>
          <el-card shadow="always" class="card-item">
            <el-col :span="12"><div id="node-status" style="width: 300px; height: 250px"></div></el-col>
            <el-col :span="12"><div id="pod-status" style="width: 300px; height: 250px"></div></el-col>
          </el-card>
        </el-main>
      </el-container>
      <el-container>
        <el-main>
          <el-row :gutter="2">
            <el-col :span="6" v-for="item in module_statuses" :key="item.name">
              <el-card shadow="always" class="module-status card-item">
                <div style="padding: 50px 0">
                  <el-row
                    ><div style="font-size: 15px">{{ item.name }}</div></el-row
                  >
                  <el-row style="font-size:30px"
                    ><span style="color: #F56C6C">{{ item.exception }}</span
                    >/<span>{{ item.total }}</span></el-row
                  >
                  <el-row><div style="color: #909399">异常/正常</div></el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>

    <el-container>
      <el-main>
        <el-row style="width: 100%">
          <el-col :span="24">
            <el-card shadow="always" :body-style="{ padding: '20px' }">
              <div slot="header" class="clearfix">
                <span style="float: left; padding: 9px 0; font-size: 20px">集群节点</span>
                <el-select v-model="node_order_by" placeholder="请选择" style="float: right; padding: 3px 0;">
                  <el-option v-for="item in order_by_options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </div>
              <el-table :data="nodes" stripe style="width: 100%">
                <el-table-column label="节点">
                  <template slot-scope="scope">
                    <el-row>
                      <i class="el-icon-s-platform" />
                      <span style="font-size:18px">{{ scope.row.name }}</span>
                    </el-row>
                    <el-row>
                      <span style="font-size:12px">{{ scope.row.ip }}</span>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="CPU" width="200px">
                  <template slot-scope="scope">
                    <el-row>
                      <el-progress :text-inside="true" :stroke-width="12" :percentage="scope.row.cpu.limitPercentage"></el-progress>
                    </el-row>
                    <el-row>
                      <el-progress status="success" :text-inside="true" :stroke-width="12" :percentage="scope.row.cpu.requestPercentage"></el-progress>
                    </el-row>
                    <el-row>
                      <div style="font-size:12px">limit: {{ scope.row.cpu.limit }} request: {{ scope.row.cpu.request }} 总共: {{ scope.row.cpu.total }}</div>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="内存" width="300px">
                  <template slot-scope="scope">
                    <el-row>
                      <el-progress :text-inside="true" :stroke-width="12" :percentage="scope.row.memory.limitPercentage"></el-progress>
                    </el-row>
                    <el-row>
                      <el-progress status="success" :text-inside="true" :stroke-width="12" :percentage="scope.row.memory.requestPercentage"></el-progress>
                    </el-row>
                    <el-row>
                      <div style="font-size:12px">limit: {{ scope.row.memory.limit }}Gi,request:{{ scope.row.memory.request }}Gi 总共: {{ scope.row.memory.total }}Gi</div>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="容器组">
                  <template slot-scope="scope">
                    <el-row>
                      <div style="font-size:12px">已启动: {{ scope.row.containers.total }} 异常: {{ scope.row.containers.exception }}</div>
                    </el-row>
                    <el-row>
                      <div style="font-size:12px">限制: {{ scope.row.containers.limit }}</div>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="镜像">
                  <template slot-scope="scope">
                    <div>数目: {{ scope.row.image.total }}</div>
                    <div>占用磁盘大小: {{ scope.row.image.disk }}Gi</div>
                  </template>
                </el-table-column>
                <el-table-column label="节点状态">
                  <template slot-scope="scope">
                    <div>{{ scope.row.node_status }}</div>
                    <div style="font-size: 12px; color:#F56C6C">{{ scope.row.error_msg }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      etcd_url: '',
      redis_url: '',
      kubernetes_url: '',
      docker_url: '',
      login_url: '',
      node_switch: '',

      node_order_by: 'memory',
      order_by_options: [
        {
          value: 'memory',
          label: '按内存使用率',
        },
        {
          value: 'cpu',
          label: '按CPU使用率',
        },
      ],

      node_total: 0,
      node_exception: 0,
      pod_total: 0,
      pod_exception: 0,

      nodes: [],
      module_statuses: [],
      status_timer: null,
      echart_pie_node: null,
      echart_pie_pod: null,
      user: {
        username: '',
        login_time: '',
      },
    }
  },

  computed: {
    node_normal: function() {
      return this.node_total - this.node_exception
    },
    pod_normal: function() {
      return this.pod_total - this.pod_exception
    },
  },
  mounted() {
    this.clusterStatus()
    this.status_timer = setInterval(this.clusterStatus, 10000)

    let user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user.username = user.username
    this.user.login_time = new Date(user.login_time).toLocaleString()
  },
  created() {
    let urlEtcdTemp = 'assets/etcd.jpeg'
    this.etcd_url = require('@/' + urlEtcdTemp)

    let urlRedisTemp = 'assets/redis.jpeg'
    this.redis_url = require('@/' + urlRedisTemp)

    let urlDockerTemp = 'assets/docker.jpeg'
    this.docker_url = require('@/' + urlDockerTemp)

    let urlKubernetesTemp = 'assets/kubernetes.jpeg'
    this.kubernetes_url = require('@/' + urlKubernetesTemp)

    let urlLoginTemp = 'assets/login.jpeg'
    this.login_url = require('@/' + urlLoginTemp)
  },
  destroyed() {
    if (this.status_timer != null) {
      clearInterval(this.status_timer)
    }
  },

  methods: {
    floatToPrecision(num, precision) {
      return parseFloat(num).toFixed(precision)
    },
    parsePercentage(n1, n2) {
      let percentage = this.floatToPrecision((n1 / n2) * 100, 2)
      if (percentage == '0.00') {
        return 0
      }
      return parseFloat(percentage)
    },

    parseResourceSize(size) {
      return this.floatToPrecision(size / 1024 / 1024 / 1024, 2)
    },
    refreshNodeStatus() {
      if (this.echart_pie_node == null) {
        this.echart_pie_node = echarts.init(document.getElementById('node-status'))
      }

      if (this.echart_pie_pod == null) {
        this.echart_pie_pod = echarts.init(document.getElementById('pod-status'))
      }

      let node_option = {
        title: {
          text: 'Node节点',
          left: 'center',
          top: '2%',
          textStyle: {
            fontSize: 16,
          },
        },
        legend: {
          left: 'center',
          bottom: 0,
          orient: 'horizontal',
        },
        series: [
          {
            name: 'Node',
            type: 'pie',
            radius: ['30%', '70%'],
            label: {
              show: false,
            },
            data: [
              { value: this.node_normal, name: '正常:' + this.node_normal, itemStyle: { color: '#409EFF' } },
              { value: this.node_exception, name: '异常:' + this.node_exception, itemStyle: { color: '#909399' } },
            ],
          },
        ],
      }
      this.echart_pie_node.setOption(node_option)

      let pod_option = {
        title: {
          text: 'Pod实例',
          left: 'center',
          top: '2%',
          textStyle: {
            fontSize: 16,
          },
        },
        legend: {
          left: 'center',
          bottom: 0,
          orient: 'horizontal',
        },
        series: [
          {
            name: 'Pod',
            type: 'pie',
            radius: ['30%', '70%'],
            label: {
              show: false,
            },
            data: [
              { value: this.pod_normal, name: '正常:' + this.pod_normal, itemStyle: { color: '#409EFF' } },
              { value: this.pod_exception, name: '异常:' + this.pod_exception, itemStyle: { color: '#909399' } },
            ],
          },
        ],
      }
      this.echart_pie_pod.setOption(pod_option)
    },
    clusterStatus() {
      console.log('clusterStatus')
      this.getRequest('/cluster/status').then((resp) => {
        if (resp) {
          // console.log(resp)
          this.node_total = resp.nodeTotal
          this.node_exception = resp.nodeException
          this.pod_total = resp.podTotal
          this.pod_exception = resp.podException

          this.nodes = []
          for (let name in resp.nodeStatuses) {
            let node = resp.nodeStatuses[name]
            this.nodes.push({
              name: node.name,
              ip: node.ip,
              image: {
                total: node.imageTotal,
                disk: this.parseResourceSize(node.imageDiskTotalByte),
              },
              cpu: {
                total: node.cpuTotal,
                limit: node.cpuLimit,
                limitPercentage: this.parsePercentage(node.cpuLimit, node.cpuTotal),
                request: node.cpuRequest,
                requestPercentage: this.parsePercentage(node.cpuRequest, node.cpuTotal),
              },
              memory: {
                total: this.parseResourceSize(node.memoryTotal),
                limit: this.parseResourceSize(node.memoryLimit),
                limitPercentage: this.parsePercentage(node.memoryLimit, node.memoryTotal),
                request: this.parseResourceSize(node.memoryRequest),
                requestPercentage: this.parsePercentage(node.memoryRequest, node.memoryTotal),
              },
              containers: {
                limit: node.containerLimit,
                total: node.containerTotal,
                exception: node.containerException,
              },
              node_status: node.isHealth ? '正常' : '异常',
              error_msg: node.errMsg,
            })
          }

          this.module_statuses = []
          for (let moduleName in resp.moduleStatuses) {
            let module_status = resp.moduleStatuses[moduleName]
            this.module_statuses.push({
              name: moduleName,
              total: module_status.total,
              exception: module_status.exception,
            })
          }
          this.refreshNodeStatus()
        }
      })
    },
  },
}
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
/* .module-status {
  height: 250px;
} */
.card-item {
  height: 300px;
}
</style>
