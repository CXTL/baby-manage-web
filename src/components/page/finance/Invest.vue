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
                    <!--                    <el-form-item label="帐套名称：">-->
                    <!--                        <el-input v-model="query.accountCode" class="input-width" placeholder="帐套名称"></el-input>-->
                    <!--                    </el-form-item>-->

                    <el-form-item label="帐套名称：">
                        <el-select v-model="query.accountCode" placeholder="全部" clearable class="input-width">
                            <el-option
                                    v-for="item in accountData"
                                    :key="item.id"
                                    :label="item.accountName"
                                    :value="item.accountCode">
                            </el-option>
                        </el-select>
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
                <el-table-column  label="ID" prop="id" width="55" align="center"></el-table-column>
                <el-table-column  label="帐套名称"  prop="accountName" align="center"></el-table-column>
                <el-table-column  label="科目编号"  prop="subjectCode" align="center"></el-table-column>
                <el-table-column  label="投资人名称" prop="investName"  align="center"></el-table-column>
                <el-table-column label="投资款" prop="investFund" align="center"></el-table-column>
                <el-table-column label="投资总额" prop="investAmount" align="center"></el-table-column>
                <el-table-column label="投资比例" prop="investRatio" align="center"></el-table-column>

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
                :title="isEdit?'编辑投资人信息':'添加投资人信息'"
                :visible.sync="dialogVisible"
                width="40%">
            <el-form :model="invest"
                     ref="investForm"
                     label-width="150px" size="small">



                <el-form-item label="帐套名称：">
                    <el-select v-model="invest.accountCode" placeholder="请选择" style="width: 250px">
                        <el-option
                                v-for="item in accountData"
                                :key="item.id"
                                :label="item.accountName"
                                :value="item.accountCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item label="科目编号：">
                        <el-input v-model="invest.subjectCode" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="投资人名称：">
                        <el-input v-model="invest.investName" style="width: 250px"></el-input>
                    </el-form-item>
                    <el-form-item label="投资款：">
                        <el-input v-model="invest.investFund" style="width: 250px"></el-input>
                    </el-form-item>

                    <el-form-item label="投资总额：">
                        <el-input v-model="invest.investAmount" style="width: 250px"></el-input>
                    </el-form-item>

                    <el-form-item label="投资比例：">
                        <el-input v-model="invest.investRatio" style="width: 250px"></el-input>
                    </el-form-item>



                    <el-form-item label="备注：">
                        <el-input v-model="invest.remark"
                                  type="textarea"
                                  :rows="5"
                                  style="width: 250px"></el-input>
                    </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchInvestData,listAccountData } from '@/api/index';
    import { formatDate,getFirstTimestamp, getLastTimestamp } from '@/utils/date';
    import { createInvest, deleteInvest,  updateInvest} from '@/api/invest';

    const defaultListQuery = {
    accountCode: null,
    endTime:'',
    startTime: '',
    page: 1,
    size: 10
}

const defaultInvest = {
    id: null,
    accountCode: null,
    subjectCode: null,
    investName: null,
    investFund: null,
    investAmount: null,
    investRatio: null,
    remark: null
};

export default {
    name: 'basetable',
    data() {
        return {
            accountData:[],
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
            dialogVisible: false,
            listLoading:false,
            isEdit: false,
            total: 0,
            form: {},
            invest: Object.assign({}, defaultInvest),
            idx: -1,
            id: -1
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
            }
            else {
                return 'N/A';
            }
        },
    },
    methods: {
        handleDateChange(){
            this.getData();
        },
        handleResetSearch() {
            this.query = Object.assign({}, defaultListQuery);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.invest = Object.assign({},row);
        },

        handleAdd(index, row) {
            this.dialogVisible = true;
            this.isEdit = false;
            this.invest = Object.assign({},defaultInvest);
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.listLoading=true;
            this.query.startTime = getFirstTimestamp(this.queryDate[0]);
            this.query.endTime = getLastTimestamp(this.queryDate[1]);
            fetchInvestData(this.query).then(res => {
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
                    deleteInvest(params).then(res =>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })

                })
                .catch(() => {});
        },
        initOrderCountDate(){
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.queryDate=[start,end];
            console.log(this.queryDate)
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
                deleteInvest(params).then(response=>{
                    this.getData();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })
        },
        //页面编辑
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateInvest(this.invest).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible =false;
                        this.getData();
                    })
                } else {
                    createInvest(this.invest).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible =false;
                        this.getData();
                    })
                }
            })
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

        // 获取帐套列表
        getAccountData() {
            listAccountData().then(res=>{
                this.accountData = res.data
            })
        },



    },
    created() {
        this.initOrderCountDate();
        this.getAccountData();
        this.getData();
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
