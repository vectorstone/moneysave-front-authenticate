<template>
  <div>
    <div style="margin: 15px">
      <el-button type="primary" @click="handleUpload">upload<i class="el-icon-upload el-icon-right"></i></el-button>
      <el-button type="primary" @click="handleDownload">download<i class="el-icon-download el-icon-right"></i></el-button>
      <el-button size="mini" type="success" @click="handleSaveFather()">add father node</el-button>
    </div>
    <!-- 导入表格控件,用来展示字典数据 -->
    <el-table :data="dicts" style="width: 100%" row-key="id" border lazy :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" label="name" width="180"> </el-table-column>
      <el-table-column prop="value" label="value" width="180"> </el-table-column>
      <el-table-column prop="dictCode" label="dict code" width="180">
      </el-table-column>
      <el-table-column label="operate">
        <template slot-scope="scope">
          <!-- 新增按钮只是用来新增下级节点,并且只在父节点的那一行生效 -->
          <el-button size="mini" type="success" @click="handleSave(scope.row)"
            :disabled="scope.row.parentId != 1">add</el-button>
          <el-button size="mini" type="warning " @click="handleEdit(scope.row)">update</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            :disabled="scope.row.hasChildren">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 导入新增和修改的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-form>
        <el-form-item property="name" label="name" width="150">
          <el-input v-model="dict.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 父节点的value不能新增和修改 -->
        <!-- 子节点的dictCode不能新增和修改 -->
        <el-form-item property="value" label="值" width="200" v-if="dict.parentId != 1">
          <el-input v-model="dict.value" autocomplete="off" v-if="dict.parentId != 1"></el-input>
        </el-form-item>
        <el-form-item property="dictCode" label="dict code" v-if="dict.parentId == 1">
          <el-input v-model="dict.dictCode" autocomplete="off" v-if="dict.parentId == 1"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">cancel</el-button>
        <el-button type="primary" @click="handleSaveDict">submit</el-button>
      </div>
    </el-dialog>

    <!-- 导入上传文件的对话框 -->
    <el-dialog title="导入Excel" :visible.sync="dialogFormVisible">
      <el-upload class="upload-demo" drag :action="uploadPath" :on-preview="handlePreview" :on-success="uploadSuccess"
        :on-error="uploadError" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/system/dict";
export default {
  data() {
    return {
      title: '',
      dict: {},
      //控制修改和新增窗口的开启和关闭
      dialogTableVisible: false,
      dicts: [],
      //控制上传的窗口的开启和关闭
      dialogFormVisible: false,
      //控制上传的文件传输的服务器的地址
      uploadPath: process.env.VUE_APP_BASE_API + "/admin/dict/import/",
    };
  },
  methods: {
    handleSaveFather() {
      this.dict = {}
      this.dict.parentId = 1
      this.title = '新增父节点'
      this.dialogTableVisible = true

    },
    handleSaveDict() {
      if (!this.dict.id) {
        //id不存在说明是新增
        api.save(this.dict).then(res => {
          this.$message.success(res.message || '新增成功')
          this.dialogTableVisible = false
          // this.fetchData(1)
          window.location.reload()
        })

      } else {
        //id存在说明是更新
        api.update(this.dict).then(res => {
          this.$message.success(`${this.dict.name}保存${res.message}`)
          this.dialogTableVisible = false
          // this.fetchData(1)
          window.location.reload()
        })
      }
    },
    //新增的按钮
    handleSave(row) {
      this.dialogTableVisible = true;
      this.title = '新增子节点'
      this.dict = {}
      //parentId不变
      //这个地方的parentId竟然是String类型
      this.dict.parentId = row.id
      // console.log(this.dict.parentId);
      // console.log(1);
      // console.log('1');
    },
    //修改的按钮
    handleEdit(row) {
      this.dialogTableVisible = true;
      this.title = '修改'
      api.getById(row.id).then(res => {
        this.dict = res.data.items
      })
    },
    //删除的方法
    handleDelete(row) {
      this.$confirm('该操作将永久删除数据,您确定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeById(row.id).then(res => {
          this.$message.success(`删除${row.name},${res.message}` || '成功')
          // this.fetchData(1) //刷新页面的方法不起作用
          window.location.reload()
        })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    },
    //展示子列表的方法
    load(tree, treeNode, resolve) {
      // console.log(tree.id); 可以从tree里面获取点击的那一行的数据的id
      api.getByPid(tree.id).then((res) => {
        //直接将查询到的dict的list集合丢到resolve里面,用来进行展示
        resolve(res.data.items);
      });
    },
    //查询dict的信息的方法
    fetchData(pid) {
      api.getByPid(pid).then((res) => {
        this.dicts = res.data.items;
      });
    },
    //文件上传成功后应该执行的方法
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        //说明上传成功
        this.$message.success(response.message || "上传成功");
      } else {
        //说明上传失败,这个地方服务器响应的报文的状态码仍是200
        this.$message.error("上传失败");
      }
      this.dialogFormVisible = false;
    },
    //这个地方的失败是,服务器响应报文的状态码不是200的时候回调的方法
    uploadError(err, file, fileList) {
      this.$message.error("上传失败");
      this.dialogFormVisible = false;
    },
    //真正的上传的按钮执行的方法
    handlePreview() { },
    //单击外面的上传按钮后执行的动作,让上传框弹出来
    handleUpload() {
      this.dialogFormVisible = true;
    },
    handleDownload() {
      //点击下载按钮后执行的动作
      window.location = process.env.VUE_APP_BASE_API + "/admin/dict/export";
    },
  },
  created() {
    this.fetchData(1);
  },
};
</script>
