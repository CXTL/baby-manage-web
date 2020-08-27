<template>
    <div>

        <el-card class="filter-container" shadow="never">
            <div>
                <el-button
                        style="float:right"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleSearch()"
                        size="small">
                    搜索
                </el-button>
                <el-button
                        style="float:right;margin-right: 15px"
                        @click="handleResetSearch()"
                        size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="query" size="small" label-width="140px">
                                        <el-form-item label="科目编号：">
                                            <el-input v-model="query.subjectCode" class="input-width" placeholder="科目编号"></el-input>
                                        </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
            >批量删除</el-button>
            <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    class="handle-del mr10"
                    @click="handleAdd"
            >添加</el-button>
        </el-card>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column  label="ID" prop="id" width="55" align="center"></el-table-column>
                <el-table-column  label="科目编号" prop="subjectCode"  align="center"></el-table-column>
                <el-table-column  label="科目名称" prop="subjectName"  align="center"></el-table-column>
                <el-table-column label="父科目名称" prop="parentName" align="center"></el-table-column>
                <el-table-column label="科目类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.subjectType | formatType}}
                    </template>
                </el-table-column>
                <el-table-column label="借贷方向" align="center">
                    <template slot-scope="scope">
                        {{scope.row.borrowFlag | formatBorrow}}
                    </template>
                </el-table-column>


                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-edit"
                                   @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>

                    </template>
                </el-table-column>
            </el-table>


        <div class="pagination">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                    layout="total, sizes,prev, pager, next,jumper"
                    :current-page="query.page"
                    :page-size="query.size"
                    :page-sizes="[5,10,15]"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog
                :title="'选择科目'"
                :visible.sync="dialogSubjectVisible"
                width="40%">


            <el-card class="form-container" shadow="never">
                <el-tree
                        :data="subjectTreeList"
                        default-expand-all
                        :filter-node-method="filterNode"
                        class="filter-tree"
                        highlight-current
                        ref="tree2"
                        :props="defaultProps">
                </el-tree>
                <div style="margin-top: 20px" align="center">
                    <el-button type="primary" @click="handleSave()">确定</el-button>
                    <el-button @click="handleClear()">取消</el-button>
                </div>

            </el-card>

        </el-dialog>


        <el-dialog
                :title="isEdit?'编辑科目':'添加科目'"
                :visible.sync="dialogVisible"
                width="40%">
            <el-form :model="subject"
                     ref="subject"
                     :rules="rules"
                     label-width="150px" size="small">
                    <el-form-item label="科目编号：" prop="subjectCode">
                        <el-input v-model="subject.subjectCode" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="科目名称：" prop="subjectName">
                        <el-input v-model="subject.subjectName" style="width: 250px">

                        </el-input>
                    </el-form-item>
                    <el-form-item label="父科目编号：" prop="parentName">
                        <el-input v-model="subject.parentName" disabled="true" style="width: 250px">
                            <el-button slot="append" icon="el-icon-search" @click="handleClickSubject()"></el-button>
                        </el-input>
                    </el-form-item>

                <el-form-item label="科目类型：" prop="subjectType">
                    <el-radio-group  v-model="subject.subjectType">
                        <el-radio :label="1">资产</el-radio>
                        <el-radio :label="2">负载</el-radio>
                        <el-radio :label="3">权益</el-radio>
                        <el-radio :label="4">成本</el-radio>
                        <el-radio :label="5">其他</el-radio>
                    </el-radio-group>
                </el-form-item>


                <el-form-item label="借贷方向：">
                    <el-radio-group  v-model="subject.borrowFlag">
                        <el-radio :label="0">借</el-radio>
                        <el-radio :label="1">贷</el-radio>
                        <el-radio :label="2">其他</el-radio>
                    </el-radio-group>
                </el-form-item>


                    <el-form-item label="备注：">
                        <el-input v-model="subject.remark"
                                  type="textarea"
                                  :rows="5"
                                  style="width: 250px"></el-input>
                    </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('subject')" size="small">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchSubjectData } from '@/api/index';
    import { formatDate } from '@/utils/date';
    import { createSubject, deleteSubject,  updateSubject,fetchTreeList} from '@/api/finance/subject';

    const defaultListQuery = {
    subjectCode: null,
    page: 1,
    size: 10
}

const defaultSubject = {
    id: null,
    subjectCode: null,
    subjectName: null,
    parentCode: null,
    subjectType: null,
    parentName: null,
    borrowFlag: 2,
    remark: null
};

export default {
    name: 'basetable',
    data() {
        return {
            subjectTreeList: [],
            defaultProps: {
                children: 'children',
                label: 'subjectName'
            },
            parentSubjectCode: null,
            query: Object.assign({},defaultListQuery),
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogSubjectVisible: false,
            listLoading:false,
            isEdit: false,
            total: 0,
            form: {},
            subject: Object.assign({}, defaultSubject),
            idx: -1,
            id: -1,
            rules: {

                subjectCode: [
                    { required: true, message: '请输入科目编号', trigger: 'blur' }
                ],
                subjectName: [
                    { required: true, message: '请输入科目名称', trigger: 'blur' }
                ],
                parentName: [
                    { required: true, message: '请选择父科目名称', trigger: 'blur' }
                ],
                subjectType: [
                    { required: true, message: '请选择科目类型', trigger: 'blur' }
                ],
            }
        };
    },

    filters: {
        formatTime(time) {
            if (time == null || time === '') {
                return 'N/A';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        formatType(value) {
            if (value === 1) {
                return '资产';
            }else if (value === 2){
                return '负载';
            }else if (value === 3){
                return '权益';
            }else if (value === 4){
                return '成本';
            }
            else {
                return '其他';
            }
        },
        formatBorrow(value) {
            if (value === 1) {
                return '贷';
            }else if (value === 0) {
                return '借';
            }else if (value === 2) {
                return '其他';
            }
            else {
                return 'N/A';
            }
        },
    },

    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
            console.log(val)
            console.log(this.$refs.tree2.filter(val))
        }
    },

    methods: {


        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleClickSubject() {
            this.dialogSubjectVisible = true;
            this.dialogVisible = false;
        },
        handleSave() {
            let currentNode = this.$refs.tree2.getCurrentNode();
            console.log(currentNode);
           let childrenNode = currentNode.children;
           // if(childrenNode != null && childrenNode.length>0){
           //     this.$message({
           //         message: '请选择该叶子科目',
           //         type: 'warning',
           //         duration: 1000
           //     });
           // }
            this.subject.parentCode = currentNode.subjectCode
            this.subject.parentName = currentNode.subjectName
            this.dialogVisible = true;
            this.dialogSubjectVisible = false;

        },
        handleClear() {
            this.dialogVisible = true;
            this.dialogSubjectVisible = false;
        },
        //查询科目树
        treeList() {
            fetchTreeList().then(response => {
                this.subjectTreeList = response.data;
            });
        },

        handleResetSearch() {
            this.query = Object.assign({}, defaultListQuery);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.subject = Object.assign({},row);
        },

        handleAdd(index, row) {
            this.dialogVisible = true;
            this.isEdit = false;
            this.subject = Object.assign({},defaultSubject);
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.listLoading=true;
            fetchSubjectData(this.query).then(res => {
                this.listLoading=false;
                this.tableData = res.data.list;
                this.total = res.data.total;
            });
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let ids=[];
                    let params = new URLSearchParams();
                    ids.push(row.id)
                    params.append("ids",ids);
                    deleteSubject(params).then(res =>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })


                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除
        delAllSelection() {
            console.log(this.multipleSelection)
            if(this.multipleSelection==null || this.multipleSelection.length < 1){
                this.$message({
                    message: '请选择数据',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }


            //批量删除
            this.$confirm('是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                let ids=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    ids.push(this.multipleSelection[i].id);
                }
                params.append("ids",ids);
                console.log(params)
                deleteSubject(params).then(response=>{
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })
        },

        //页面编辑
        handleDialogConfirm(subject) {

            this.$refs[subject].validate((valid) => {
                if (valid) {
                    this.$confirm('是否要确认?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.isEdit) {
                            updateSubject(this.subject).then(response => {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                this.dialogVisible =false;
                                this.getData();
                            })
                        } else {
                            createSubject(this.subject).then(response => {
                                this.$message({
                                    message: '添加成功！',
                                    type: 'success'
                                });
                                this.dialogVisible =false;
                                this.getData();
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });



        },



        // 分页导航
        handlePageChange(val) {
            this.query.page = val;
            this.getData();
        },
        // 分页导航
        handleSizeChange(val) {
            this.query.page = 1;
            this.query.size = val;
            this.getData();
        },



    },
    created() {
        this.getData();
        this.treeList();
    }

};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
