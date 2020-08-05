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
                    <el-form-item label="菜单名称：">
                        <el-input v-model="query.name" class="input-width" placeholder="菜单名称"></el-input>
                    </el-form-item>


                    <el-form-item label="创建时间：" >
                        <el-date-picker
                                style="float: right;z-index: 1"
                                size="small"
                                v-model="queryDate"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleDateChange"
                                :picker-options="pickerOptions">
                        </el-date-picker>
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
                <el-table-column label="ID"  prop="id"   width="55" align="center"></el-table-column>
                <el-table-column label="名称" prop="name" ign="center"></el-table-column>
                <el-table-column label="权限" prop="permission" align="center"></el-table-column>
                <el-table-column label="父名称" prop="pName" lign="center"></el-table-column>
                <el-table-column label="路径" prop="path" align="center"></el-table-column>
                <el-table-column label="排序" prop="sort" align="center"></el-table-column>
                <el-table-column label="图标" prop="icon" align="center"></el-table-column>
                <el-table-column label="是否隐藏" align="center">
                    <template slot-scope="scope">
                        {{scope.row.hidden | formatHidden}}
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status | formatType}}
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
                :title="isEdit?'编辑菜单':'添加菜单'"
                :visible.sync="dialogVisible"
                width="40%">
            <el-form :model="menu"
                     ref="menu"
                     :rules="rules"
                     label-width="150px" size="small">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="menu.name" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单名称：" prop="pid">
                        <el-input v-model="menu.pid" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="路径：" prop="path">
                        <el-input v-model="menu.path" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="图标：">
                        <el-input v-model="menu.icon"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-input v-model="menu.sort"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="权限：" prop="permission">
                        <el-input v-model="menu.permission"  style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="类型：" prop="type">
                        <el-radio-group v-model="menu.type">
                            <el-radio :label="1">资源权限</el-radio>
                            <el-radio :label="0">菜单权限</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否隐藏：" prop="hidden">
                        <el-radio-group v-model="menu.hidden">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>

                <el-form-item label="备注：">
                    <el-input v-model="menu.remark"
                              type="textarea"
                              :rows="5"
                              style="width: 250px"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('menu')" size="small">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
    import { fetchMenuData } from '@/api/index';
    import { formatDate,getFirstTimestamp, getLastTimestamp } from '@/utils/date';
    import {createMenu,updateMenu,deleteMenu} from '@/api/menu';
    import {isvalidNumber} from '@/utils/validate';

const defaultListQuery = {
    name: null,
    endTime:'',
    startTime: '',
    page: 1,
    size: 10
}

const defaultMenu = {
    id: null,
    name: null,
    pid: null,
    sort: null,
    path: null,
    icon: null,
    type: 0,
    hidden: 1,
    permission: null,
    remark: null
};

export default {
    name: 'basetable',
    data() {
        const validateNumber = (rule, value, callback) => {
            if (!isvalidNumber(value)) {
                callback(new Error('请输入整数!'))
            } else {
                callback()
            }
        };
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        let start = new Date();
                        start.setFullYear(start.getFullYear());
                        start.setMonth(start.getMonth());
                        start.setDate(start.getDay());
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一月',
                    onClick(picker) {
                        const end = new Date();
                        let start = new Date();
                        start.setFullYear(start.getFullYear());
                        start.setMonth(start.getMonth());
                        start.setDate(start.getDay());
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            queryDate:'',
            query: Object.assign({},defaultListQuery),
            tableData: [],
            multipleSelection: [],
            delList: [],
            dialogVisible: false,
            listLoading:false,
            isEdit: false,
            total: 0,
            form: {},
            menu: Object.assign({}, defaultMenu),
            idx: -1,
            id: -1,
            rules: {

                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                ],
                pid: [
                    {  required: true, message: '请选择父类菜单', trigger: 'change' }
                ],
                path: [
                    {  required: true, message: '请输入路径', trigger: 'change' }
                ],
                sort: [
                    {  required: true, trigger: 'change', validator: validateNumber  }
                ],
                permission: [
                    {  required: true, message: '请输入权限', trigger: 'change' }
                ],
                type: [
                    {  required: true, message: '请选择资源类型', trigger: 'change' }
                ],
                hidden: [
                    {  required: true, message: '请选择是否隐藏', trigger: 'change' }
                ]
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
        formatHidden(value) {
            if (value === 1) {
                return '是';
            } else {
                return '否';
            }
        },
        formatType(value) {
            if (value === 1) {
                return '资源权限';
            }  else {
                return '菜单权限';
            }
        },
    },
    methods: {
        handleDateChange(){
            this.getData();
        },
        initOrderCountDate(){
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.queryDate=[start,end];
            console.log(this.queryDate)
        },
        handleResetSearch() {
            this.query = Object.assign({}, defaultListQuery);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.menu = Object.assign({},row);
        },

        handleAdd(index, row) {
            this.dialogVisible = true;
            this.isEdit = false;
            this.menu = Object.assign({},defaultMenu);
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.listLoading=true;
            this.query.startTime = getFirstTimestamp(this.queryDate[0]);
            this.query.endTime = getLastTimestamp(this.queryDate[1]);
            fetchMenuData(this.query).then(res => {
                this.listLoading=false;
                this.tableData = res.data.list;
                this.total = res.data.total || 50;
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
                    deleteMenu(params).then(res =>{
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
                deleteMenu(params).then(response=>{
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })

        },

        //编辑页面
        handleDialogConfirm(menu) {

            this.$refs[menu].validate((valid) => {
                if (valid) {
                    this.$confirm('是否要确认?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.isEdit) {
                            updateMenu(this.menu).then(response => {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                this.dialogVisible =false;
                                this.getData();
                            })
                        } else {
                            createMenu(this.menu).then(response => {
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
        }


    },
    created() {
        this.initOrderCountDate();
        this.getData();
    },
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
