<template>
  <el-container direction="vertical">
    <el-header height="">
      <el-card class="box-card">
        <div class="registry-status">地址: {{ repository.address }}</div>
        <div class="registry-status">仓库状态: {{ repository.health }}</div>
        <div class="registry-status">镜像数量: {{ repository.count }}</div>
        <div class="registry-status">磁盘占用: {{ parseFloat(repository.diskSize / 1024 / 1024 / 1024).toFixed(2) }}G</div>
      </el-card>
    </el-header>
    <el-main height="">
      <el-row>
        <el-table
          :data="imagePageList"
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 1000px"
          max-height="600px"
        >
          <el-table-column prop="name" label="名称" width="300"></el-table-column>
          <el-table-column prop="version" label="版本" width="140"></el-table-column>
          <el-table-column prop="id" label="镜像ID" width="100"></el-table-column>
          <el-table-column prop="size" label="大小" width="140"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="140"></el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入关键字搜索" maxlength="30px">{{ scope.$index }}</el-input>
            </template>
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            :page-sizes="[10, 50, 100]"
            :page-size="currentPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="imageTotal"
          >
          </el-pagination>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      imageList: [],
      currentPage: 1,
      currentPageSize: 10,
      search: '',
      repository: {
        address: '',
        health: '',
        diskSize: 10,
        count: 0,
      },
      image_refresh_timer: null,
    }
  },
  computed: {
    imageTotal: function() {
      return this.imageFilterList(this.imageList).length
    },
    imagePageList: function() {
      let start = (this.currentPage - 1) * this.currentPageSize
      let end = start + this.currentPageSize
      let filterList = this.imageFilterList(this.imageList)
      return filterList.slice(start, end)
    },
  },

  mounted() {
    this.loading = true
    this.refreshImages()
    if (this.image_refresh_timer != null) {
      this.image_refresh_timer = setInterval(this.refreshImages, 2000)
    }
  },
  destroyed() {
    clearInterval(this.image_refresh_timer)
  },
  methods: {
    handleSizeChange(val) {
      this.currentPageSize = parseInt(val)
    },
    handleCurrentChange(val) {
      this.currentPage = parseInt(val)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    imageFilterList: function(imageList) {
      if (this.search != '') {
        return imageList.filter((data) => data.name.toLowerCase().includes(this.search.toLowerCase()))
      }
      return imageList
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
    floatToPrecision(num, precision) {
      return parseFloat(num).toFixed(precision)
    },
    getImageList() {
      let _this = this
      this.getRequest('/repository/images').then(function(response) {
        _this.loading = false
        _this.imageList = []
        response.forEach((image) => {
          _this.imageList.push({
            id: image.id.substr(0, 8),
            name: image.name,
            version: image.version,
            size: _this.floatToPrecision(image.size / 1024 / 1024, 2) + 'M',
            createTime: image.createTime,
          })
        })
      })
    },
    refreshImages() {
      this.repositoryStatus()
      this.getImageList()
    },
  },
}
</script>

<style>
/* .el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
} */

.text {
  font-size: 14px;
}

/* .item {
  padding: 18px 0;
} */

.box-card {
  width: 500px;
  /* height: 30px; */
}
.registry-status {
  margin: auto;
  text-align: left;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 15px;
}
</style>
