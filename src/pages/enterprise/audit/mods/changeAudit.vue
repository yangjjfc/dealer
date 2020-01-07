<template>
    <yl-dialog :title="title" :show.sync="shows" width="80%"  :hideSubmitButton="true">
        <div class="">
            <el-row :gutter="10">
                <el-col :span="4" v-if="type === 'view'">
                    <ul>
                        <li class="history-list mgb10 active">
                            <el-radio v-model="checkCurrent"  size="small" label="current">当前版本</el-radio>
                            <p>{{compare.current.operateTime}}</p>
                        </li>
                        <li class="history-list mgb10" v-for="(item, index) in historyList" :key="index" :class="{'active': checkRadio == item.id}">
                            <el-radio v-model="checkRadio" :label="item.id" size="small" @change="setHistory(item)">变更版本{{item.index}}</el-radio>
                            <p>{{item.operateTime}}</p>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="type === 'audit' ? 24 : 20">
                    <div class="mgb10">
                        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                            <el-tab-pane label="基本信息" name="first">
                                <CompareTable :list="baseInfo" :name="compareLabel"></CompareTable>
                            </el-tab-pane>
                            <el-tab-pane label="经营产品" name="second">
                                <CompareTable :list="extList" :name="compareLabel"></CompareTable>
                                <div class="yl-info-title">
                                    <h3>经营产品</h3>
                                </div>

                                <el-table :data="agentList" stripe style="width: 100%" border size="small" class="my-table">
                                    <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                                    <template v-for="item in ['current', 'old']">
                                        <el-table-column prop="" :label="item === 'current' ? '当前版本': compareLabel " :key="item">
                                            <template slot-scope="scope">
                                                <ul v-if="scope.row[item]">
                                                    <li>代理品牌： {{scope.row[item].agentBrand }}</li>
                                                    <li>代理产品： {{scope.row[item].agentProduce }}</li>
                                                </ul>
                                            </template>
                                        </el-table-column>
                                    </template>
                                </el-table>
                                <div class="yl-info-title">
                                    <h3>重要直销客户</h3>
                                </div>
                                <el-table :data="customerList" stripe style="width: 100%" border size="small" class="my-table">
                                    <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                                    <template v-for="item in ['current', 'old']">
                                        <el-table-column prop="" :label="item === 'current' ? '当前版本': compareLabel " :key="item">
                                            <template slot-scope="scope">
                                                <ul v-if="scope.row[item]">
                                                    <li>医院名称： {{scope.row[item].customerName }}</li>
                                                    <li>地址： {{scope.row[item].addr }}</li>
                                                    <li>科室： {{scope.row[item].department }}</li>
                                                    <li>联系人： {{scope.row[item].linkPerson }}</li>
                                                    <li>联系方式： {{scope.row[item].linkPhone }}</li>
                                                </ul>
                                            </template>
                                        </el-table-column>
                                    </template>
                                </el-table>

                            </el-tab-pane>
                            <el-tab-pane label="人员信息" name="third">
                                <CompareTable :list="userNumList" :name="compareLabel"></CompareTable>
                                <div class="yl-info-title">
                                    <h3>人员信息</h3>
                                </div>
                                <el-table :data="userList" stripe style="width: 100%" border size="small" class="my-table">
                                    <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                                    <template v-for="item in ['current', 'old']">
                                        <el-table-column prop="" :label="item === 'current' ? '当前版本': compareLabel " :key="item">
                                            <template slot-scope="scope">
                                                <ul v-if="scope.row[item]">
                                                    <li>姓名： {{scope.row[item].personName }}</li>
                                                    <li>职务： {{scope.row[item].job }}</li>
                                                    <li>性别： {{scope.row[item].sex == '1' ? '男' : '女'}}</li>
                                                    <li>学历： {{scope.row[item].qualification }}</li>
                                                    <li>专业： {{scope.row[item].speciality }}</li>
                                                    <li>职称： {{scope.row[item].professional }}</li>
                                                    <li>从事医疗器械行业时间： {{scope.row[item].jobTime }}</li>
                                                </ul>
                                            </template>
                                        </el-table-column>
                                    </template>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="资质材料" name="fourth">
                                <el-col :span="12" v-for="item in ['current', 'old']" :key="item">
                                    <h3 class="title mgb10">{{item === 'current' ? '当前版本' : compareLabel }}</h3>
                                    <CertIssued :list="compare[item].certVos" :type="item" :compare="compare" :isDetail="type ==='view'" :ref="'certIssued'+ item"></CertIssued>
                                </el-col>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col v-if="type === 'audit'">
                    <el-form label-width="100px" size="small" :model="auditForm" ref="auditForm" >
                        <el-form-item label="审核结果" prop="auditStatus">
                            <el-radio v-model="auditForm.auditStatus" label="audit_success">成功</el-radio>
                            <el-radio v-model="auditForm.auditStatus" label="audit_fail">失败</el-radio>
                        </el-form-item>
                        <el-form-item label="审核原因" prop="auditRemark" :rules="{ required: auditForm.auditStatus == 'audit_fail', message: '原因不能为空', trigger: 'blur'}">
                            <el-input type="textarea" v-model="auditForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button @click="gotoNext" slot="footer" size="small" type="primary" v-if="type === 'audit'">{{activeName === 'fourth' ? '提交' : '下一步'}}</el-button>
    </yl-dialog>
</template>
<script>
import CertIssued from './certIssued';
import CompareTable from './compareTable';
const URL = {
    detail: 'yhlo.brp.enterprise.getHaveRev',
    history: 'yhlo.brp.enterprisePlatform.findRevList',
    modifyAduit: 'yhlo.brp.enterprisePlatform.modifyAduit'
};
const form = {
    auditStatus: '',
    enterpriseName: '',
    address: '',
    regionCode: '',
    creditCode: '',
    establishmentDate: '',
    businessPermitCode: '',
    regStartTime: '',
    regEndTime: '',
    regLongTerm: '',
    legalPerson: '',
    capital: '',
    certVos: []
};
export default {
    data () {
        return {
            activeName: 'first',
            checkCurrent: 'current',
            auditForm: {
                auditStatus: 'audit_success',
                auditRemark: ''
            },
            compare: {
                old: {
                    ...form
                },
                current: {
                    ...form
                }
            },
            // 基础信息
            baseInfo: [
                {
                    label: '企业名称',
                    value: 'enterpriseName'
                }, {
                    label: '企业地址',
                    value: 'regionName'
                }, {
                    label: '详细地址',
                    value: 'address'
                }, {
                    label: '统一社会信用码',
                    value: 'creditCode'
                }, {
                    label: '成立日期',
                    value: 'establishmentDate'
                }, {
                    label: '注册资金',
                    value: 'capital'
                }, {
                    label: '经营许可证编码',
                    value: 'businessPermitCode'
                }, {
                    label: '注册时间',
                    value: (item) => `${item.regStartTime} - ${item.regLongTerm === 1 ? '长期' : item.regEndTime}`
                }, {
                    label: '法定代表人',
                    value: 'legalPerson'
                }
            ],
            // 扩展信息
            extList: [
                {
                    label: '上年度总营业额',
                    value: (item) => item.lastyearAmount ? `${item.lastyearAmount || ''}万` : ''
                }, {
                    label: '上年度代理亚辉龙产品销售额',
                    value: (item) => item.lastyearYhloAmount ? `${item.lastyearYhloAmount || ''}万` : ''
                }, {
                    label: '仓库情况',
                    value: (form) => `${form.housewareType === '1' ? '自有' : form.housewareType === '2' ? '租赁' : '未设置'}`
                }, {
                    label: '面积',
                    value: 'housewareArea'
                }, {
                    label: '期限',
                    value: (item) => `${item.housewareStartTime || ''} ${item.housewareEndTime ? '-' + item.housewareEndTime : ''}`
                }, {
                    label: '是否具有售后服务的能力',
                    value: (form) => `${form.afterSale === 1 ? '是' : '否'}`
                }, {
                    label: '售后服务人数',
                    value: 'afterSaleNum'
                }
            ],
            // 经营产品
            agentList: [],
            // 重要直销客户
            customerList: [],
            // 人员信息
            userNumList: [
                {
                    label: '总人数',
                    value: 'personNum'
                }, {
                    label: '业务员数量',
                    value: 'businessNum'
                }, {
                    label: '技术人员数量',
                    value: 'technicianNum'
                }
            ],
            userList: [],
            historyList: [],
            checkRadio: '',
            compareLabel: '对比版本'
        };
    },
    directives: {

    },
    components: {
        CertIssued,
        CompareTable
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Object
        },
        type: {
            type: String,
            default: 'audit',
            validator (val) {
                return ['audit', 'view'].includes(val);
            }
        }
    },
    methods: {
        // 只有最后一个tabs 才能提交
        gotoNext () {
            let tabs = ['first', 'second', 'third', 'fourth'];
            let current = tabs.indexOf(this.activeName);
            if (current !== tabs.length - 1) {
                this.activeName = tabs[current + 1];
            } else {
                this.auditSubmit();
            }
        },
        // 对比结果
        compareVal (item, vals) {
            let isDiff = false;
            if (item === 'current') {
                let keys = vals.split(',');
                keys.forEach(data => {
                    if (this.compare.old[data] !== this.compare.current[data]) {
                        isDiff = true;
                    }
                });
            }
            if (isDiff) {
                return 'text-danger';
            } else {
                return '';
            }
        },
        // 撤回
        cancel () {
            this.Http(URL.updateStatusRollback, {
                enterpriseNo: this.enterpriseNo
            }).then(res => {
                if (res.data === true) {
                    this.$message.success('操作成功');
                    this.getDetail();
                    this.$emit('updateTip', '');
                }
            });
        },
        // 查看历史
        getHistory () {
            this.Http(URL.history, {
                enterpriseNo: this.data.enterpriseNo
            }).then(results => {
                let data = results.data || [];
                this.historyList = data.map((item, index) => {
                    item.index = data.length - index;
                    return item;
                });
                this.compare.old = this.historyList[0] || { ...form, certVos: [], agentList: [], customerList: [], userList: [] };
                if (this.compare.old.id) {
                    this.checkRadio = this.compare.old.id;
                    this.compareLabel = `对比版本(变更版本${this.compare.old.index})`;
                }
                this.getCompareData();
            });
        },
        setHistory (item) {
            this.compare.old = item;
            this.compareLabel = `对比版本(变更版本${item.index})`;
            this.getCompareData();
        },
        // 获取正式企业详情
        getDetail () {
            return this.Http(URL.detail, {
                enterpriseNo: this.data.enterpriseNo,
                isAduited: this.type === 'view' ? '1' : '0'
            }).then(results => {
                let data = results.data || {};
                this.compare.current = { ...data, oldEnterprise: null };
                if (this.type === 'audit') {
                    this.compare.old = { ...data.oldEnterprise };
                    this.getCompareData();
                }
            });
        },
        // 数据处理
        getCompareData () {
            let getValue = (key, source) => typeof key === 'function' ? key(source) : source[key];
            let washingData = (list) => list.map(item => {
                item.current = getValue(item.value, this.compare.current);
                item.old = getValue(item.value, this.compare.old);
                item.isDiff = item.current !== item.old;
                return item;
            });
            let washingList = (source) => {
                let old = this.compare.old[source],
                    current = this.compare.current[source];
                let relativelyLength = Math.max(old.length, current.length);
                this[source] = [];
                for (let i = 0; i < relativelyLength; i++) {
                    this[source].push({
                        index: i + 1,
                        current: current[i],
                        old: old[i]
                    });
                }
            };
            this.baseInfo = washingData(this.baseInfo);
            this.extList = washingData(this.extList);
            this.userNumList = washingData(this.userNumList);
            // 经营产品
            washingList('agentList');
            // 重要直销客户
            washingList('customerList');
            // 人员信息
            washingList('userList');
        },
        // 检查证照审核 和 基本信息审核是否冲突
        checkValidResult () {
            let result = true,
                certDom = this.$refs.certIssuedcurrent[0],
                certValid = true;
            console.log(certDom);
            certDom.form.certs.forEach(item => {
                item.status === '0' && (certValid = false);
            });
            if (!certValid && this.auditForm.auditStatus === 'audit_success') {
                result = false;
            }
            return result;
        },
        // 审核
        auditSubmit () {
            let certDom = this.$refs.certIssuedcurrent[0],
                form = certDom.$refs.certs,
                audit = this.$refs.auditForm;
            if (!this.checkValidResult()) {
                this.$message.info(
                    '您的证照审核失败，总审核结果为成功，请修改后提交。'
                );
                return;
            }
            audit.validate(valid => {
                if (valid) {
                    form.validate(valid => {
                        if (valid) {
                            let params = {
                                enterpriseNo: this.data.enterpriseNo,
                                ...this.auditForm
                            };
                            this.Http(URL.modifyAduit, {
                                params,
                                recordList: certDom.form.certs
                            }).then(results => {
                                this.$message.success('审核成功');
                                this.shows = false;
                                this.$emit('update');
                            });
                        }
                    });
                }
            });
        }
    },
    created () {
        this.getDetail().then(res => {
            if (this.type === 'view') {
                this.getHistory();
            }
        });
    },
    computed: {
        title () {
            return this.type === 'audit' ? '审核企业信息' : '历史信息';
        },
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    }
};

</script>
<style lang="scss" scoped>
    $primary:#03A8AE;
    .title{
        background-color: #f4f4f4;
        line-height: 35px;
        font-size: 15px;
        padding-left: 5px;
    }
    .history-list{
        padding: 5px;
        border-radius: 3px;
        border: solid 1px #eee;
        &.active{
            border-color: $primary;
        }
        p {
            line-height: 22px;
        }
    }
</style>
