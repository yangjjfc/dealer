<!-- 企业管理 -> 企业审核 -->
<template>
    <section class="">
        <!-- search box -->
        <div class=" clearfix">
            <el-form :inline="true" :model="search" size="small">
                <el-form-item label="">
                    <el-select v-model="search.auditStatus" placeholder="请选择审核状态" @change="getList(1)" class="w100">
                        <el-option v-for="item in auditStatusData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="search.agentLevel" placeholder="经销商等级" @change="getList(1)" >
                        <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="searchBox">
                    <el-input placeholder="经销商编号/账号/经销商名称/联系人/手机号码" class="w300" size="small" v-model.trim="search.keywords" @keyup.enter.native="getList()"></el-input>
                    <el-button type="primary" class="mgr10" icon="el-icon-search" size="small" @click="getList(1)">查询</el-button>
                    <el-button type="default" size="small" @click="resetSearch()">重置</el-button>
                </el-form-item>
                <!--<el-form-item class="right">
                    <el-button type="primary" size="small" class="right" @click="handleRegistration('add')" >导入</el-button>
                </el-form-item>-->
            </el-form>
        </div>
        <!-- table -->
        <yl-table :data="list" :config="config" class="my-table mgb10">
            <el-table-column prop="enterpriseName" :label="props.label" min-width="140" slot-scope="props" :fixed="props.col.fixed" slot="enterpriseName">
                <template slot-scope="scope">
                    <span class="mgl10">{{ scope.row.enterpriseName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operate" :label="props.label" width="80" slot-scope="props" :fixed="props.col.fixed" slot="operate">
                <template slot-scope="scope">
                    <template v-if="auditType=='0'">
                        <el-button type="text" v-if="scope.row.auditStatus == 'auditing'" v-auth:BUTTON_AUDITINGDEALER_ADUIT @click="gotoDetail(scope.row)">审核</el-button>
                        <el-button type="text" v-else @click="gotoDetail(scope.row)" v-auth:BUTTON_AUDITINGDEALER_DETAIL>详情</el-button>
                    </template>
                    <template v-else>
                        <el-button type="text" v-if="scope.row.auditStatus == 'auditing'" v-auth:BUTTON_CHANGEINFO_AUDIT @click="showChange(scope.row)">审核</el-button>
                        <el-button type="text" v-else @click="gotoDetail(scope.row)" v-auth:BUTTON_CHANGEINFO_DETAIL>详情</el-button>
                    </template>
                </template>
            </el-table-column>
        </yl-table>
        <!-- page -->
        <yl-pagination :total="page.total" class="right" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></yl-pagination>
        <!-- dialog -->
        <div v-if="dialogForm.show">
            <DialogForm :show.sync="dialogForm.show" :dialogData="dialogForm.dialogData" :type="dialogForm.type" :tabType="dialogForm.tabType" @change="getList"></DialogForm>
        </div>
        <!-- 创建企业 -->
        <div v-if="registrationData.show">
            <Registration :show.sync="registrationData.show" :dialogData="registrationData.dialogData" :type="registrationData.type" @change="getList"></Registration>
        </div>
        <!--审核变更-->
        <ChangeAudit v-if="auditObj.show" :show.sync="auditObj.show" :data="auditObj.data" @update="getList(1)"></ChangeAudit>
    </section>
</template>
<script>
import DialogForm from '../mods/dialog';
import Registration from '../mods/registration';
import commonMix from '@/utils/mixins/commonMix.js';
import ChangeAudit from './mods/changeAudit';
import { Tools } from 'ycloud-ui';
const URL = {
    list: 'yhlo.brp.enterprisePlatform.findAuditPageList'
};
const search = {
    auditType: '',
    agentLevel: null,
    keywords: '',
    auditStatusList: ['audit_wait', 'auditing', 'audit_fail'],
    auditStatus: 'auditing'
};
let auditStatusData = [{
    value: null,
    label: '审核状态'
}, {
    value: 'auditing',
    label: '待审核'
}, {
    value: 'audit_fail',
    label: '审核失败'
}];
export default {
    name: 'enterpriseAudit',
    mixins: [commonMix],
    data () {
        return {
            activeTab: 'all',
            activeURL: '',
            showAuditStatus: true,
            auditStatusData,
            levels: [
                {
                    label: '经销商等级',
                    value: null
                }, {
                    label: '经销商',
                    value: '1'
                }, {
                    label: '代理商',
                    value: '2'
                }, {
                    label: '策略经销商',
                    value: '3'
                }
            ],
            search: {
                ...search
            },
            registrationData: {
                show: false,
                dialogData: {},
                type: 'add'
            },
            dialogForm: {
                show: false,
                dialogData: {},
                type: 'view',
                tabType: false
            },
            value: '',
            list: [],
            auditObj: {
                show: false,
                data: null
            },
            config: {
                name: 'enterpriseAll',
                uselocal: true,
                col: [{
                    type: 'index',
                    index: () => (this.page.pageIndex - 1) * this.page.pageSize + 1,
                    label: '序号',
                    width: 50,
                    show: true,
                    align: 'center',
                    unSave: true,
                    fixed: true
                },
                { label: '经销商编号', prop: 'outEnterpriseNo' },
                { label: '经销商名称', prop: 'enterpriseName' },
                { label: '经销商等级', prop: 'levelName' },
                { label: '地区', prop: 'regionName' },
                { label: '联系人', prop: 'linkPerson' },
                { label: '手机号码', prop: 'linkPhone' },
                { label: '提交时间', prop: 'operateTime' },
                { label: '审核状态', prop: 'statusStr' },
                {
                    type: 'operate',
                    slot: 'operate',
                    label: '操作',
                    width: 60,
                    fixed: 'right'
                }
                ]
            }
        };
    },
    props: {
        auditType: {
            type: String
        }
    },
    methods: {
        // 重置密码
        resetPassword (row) {
            this.$confirm('确定要重置帐号【' + row.userAccountVo.loginAccount + '】的密码吗？', '重置密码确认', {
                type: 'warning'
            }).then(() => {
                this.Http(URL.resetPwd, {
                    loginAccount: row.userAccountVo.loginAccount
                }).then(result => {
                    this.$message({
                        type: 'success',
                        message: '重置密码成功'
                    });
                    // this.getList();
                }).catch(cal => {});
            });
        },
        showChange (item) {
            this.auditObj = {
                show: true,
                data: item
            };
        },
        // 重置
        resetSearch () {
            this.search = {
                ...search,
                auditType: this.auditType
            };
            this.getList(1);
        },

        // 打开弹框
        gotoDetail (rowData) {
            this.$router.push({
                name: 'enterpriseDetail',
                query: {
                    enterpriseNo: rowData.enterpriseNo,
                    sourceName: this.$route.name,
                    auditType: this.auditType
                }
            });
        },

        // 创建编辑弹框企业
        handleRegistration (type, rowData) {
            if (type === 'add') {
                this.registrationData.type = 'add';
                this.registrationData.dialogData = {};
            } else {
                this.registrationData.type = 'edit';
                this.registrationData.dialogData = rowData;
            }
            this.registrationData.show = true;
        },

        // 查询列表数据
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            this.Http(URL.list, {
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                params: this.search
            }).then((res) => {
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                this.list = res.data.rows.map((item, index) => {
                    item.index = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                    item.levelName = Tools.getSelectValue(item.agentLevel, this.levels);
                    item.statusStr = Tools.getSelectValue(item.auditStatus, this.auditStatusData);
                    return item;
                });
            });
        }
    },
    mounted () {
        /* this.search.auditStatusData = [...auditStatusData].concat({
            value: 'audit_success',
            label: '审核通过'
        }, {
            value: 'audit_wait',
            label: '草稿'
        }); */
        this.search.auditType = this.auditType;
        this.getList();
    },
    components: {
        DialogForm,
        Registration,
        ChangeAudit
    }
};

</script>
<style lang="scss" scoped>
</style>
