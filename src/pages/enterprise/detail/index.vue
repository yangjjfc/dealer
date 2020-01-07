<!--企业信息-->
<template>
    <div class="">
        <div class="enterprise-info">
            <div v-if="form.sourceStatus == 'imported' || form.auditStatus == 'audit_wait' " style="padding-top: 30px;">
                <div class="text-right">
                    <el-button @click="goBack" size="small">返回</el-button>
                </div>
                <el-row>
                    <el-col offset="2" :span="20">
                        <el-form :model="form" size="small">
                            <el-form-item label="经销商名称">
                                <p v-text="form.enterpriseName"></p>
                            </el-form-item>
                            <el-form-item label="经销商编号">
                                <p v-text="form.outEnterpriseNo"></p>
                            </el-form-item>
                            <el-form-item label="联系人">
                                <p v-text="form.linkPerson"></p>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <p v-text="form.linkPhone"></p>
                            </el-form-item>
                            <el-form-item label="邮编">
                                <p v-text="form.email"></p>
                            </el-form-item>
                            <el-form-item v-if="form.sourceStatus == 'imported'">
                                <el-button @click="delEnterprise" type="danger">删除经销商</el-button>
                                <el-button @click="createAccount" type="primary">创建账户</el-button>
                            </el-form-item>
                            <el-form-item>
                                <h3 class="text-warning">信息档案经销商未提交</h3>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <el-row v-else>
                <el-col :span="24" class="colspan">
                    <div style="position: absolute; right: 0; z-index: 333">
                        <el-button type="" size="small" @click="goBack">返回</el-button>
                    </div>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="信息档案" name="first">
                            <div class="audit-img"><img :src="auditStatusImg" /></div>
                            <BaseInfo :form="form"></BaseInfo>
                        </el-tab-pane>
                        <el-tab-pane label="资质材料" name="second">
                            <CertIssued :list="form.certVos" :isAudit="form.auditStatus == 'auditing' " ref="CertIssuedEdit"></CertIssued>
                            <el-form :model="audit" :rules="rules" ref="audit" size="small" v-if="form.auditStatus == 'auditing'" label-width="100px" label-suffix="：">
                                <el-form-item label="审核结果" prop="auditStatus">
                                    <el-radio v-model="audit.auditStatus" label="audit_success">成功</el-radio>
                                    <el-radio v-model="audit.auditStatus" label="audit_fail">失败</el-radio>
                                </el-form-item>
                                <el-form-item label="审核原因" prop="auditRemark" :rules="{ required: audit.auditStatus == 'audit_fail', message: '原因不能为空', trigger: 'blur'}">
                                    <el-input type="textarea" v-model="audit.auditRemark"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="开票信息" name="third" v-if="form.auditStatus == 'audit_success'">
                            <InvoiceList v-if="activeName === 'third'" :enterpriseNo="enterpriseNo"></InvoiceList>
                        </el-tab-pane>
                        <el-tab-pane label="签收地址" name="fourth" v-if="form.auditStatus == 'audit_success'">
                            <ReceipList v-if="activeName === 'fourth'" :enterpriseNo="enterpriseNo"></ReceipList>
                        </el-tab-pane>
                        <el-tab-pane label="授权区域" name="fives" v-if="form.auditStatus == 'audit_success'">
                            <AuthorizedArea v-if="activeName === 'fives'" :enterpriseNo="enterpriseNo"></AuthorizedArea>
                        </el-tab-pane>
                        <el-tab-pane label="业务信息" name="six" v-if="form.auditStatus == 'audit_success'">
                            <BusinessInfo v-if="activeName === 'six'" :enterpriseNo="enterpriseNo"></BusinessInfo>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="text-center" v-if="form.auditStatus == 'auditing'">
                        <el-button type="primary" @click="activeName = 'second' " size="small" v-if="activeName == 'first'">下一步</el-button>
                        <template v-else>
                            <el-button type="primary" @click="activeName = 'first'" size="small">上一步</el-button>
                            <el-button type="primary" @click="auditSubmit" size="small">审核</el-button>
                        </template>
                    </div>
                </el-col>
            </el-row>

        </div>
        <!--//开户-->
        <!-- <CreateAccount v-if="add.show" :show.sync="add.show" :data="add.data" :checkNo="enterpriseNo" @change="init"></CreateAccount> -->

        <!-- <div v-if="application.show">
            <add-application :show.sync="application.show" :data="application.data" @update="getList"></add-application>
        </div> -->
    </div>
</template>
<script>
import BaseInfo from './mods/baseInfo';
import CertIssued from './mods/certIssued';
import InvoiceList from './mods/invoiceList';
import ReceipList from './mods/receiptList';
import AuthorizedArea from './mods/authorizedArea';
import BusinessInfo from './mods/businessInfo';
import { mapActions } from 'vuex';
// import imgSuccess from '@/assets/images/stamp_pass.png';
// import imgAudit from '@/assets/images/stamp_audit.png';
// import imgFail from '@/assets/images/stamp_fail.png';
// import imgWait from '@/assets/images/stamp_wait.png';
// import caogao from '@/assets/images/caogao.png';
// import CreateAccount from '@/pages/agency/account/mods/add.vue';
// import AddApplication from '@/pages/application/open/mods/AddApplication.vue';

// 请求链接
const URL = {
    detail: 'yhlo.brp.enterprise.getHaveRev',
    modifyAduit: 'yhlo.brp.enterprisePlatform.modifyAduit',
    del: 'yhlo.brp.enterprisePlatform.deleteEnterprise'
};
//

export default {
    data () {
        return {
            activeName: 'first',
            enterpriseNo: '',
            // 添加
            add: {
                show: false
            },
            application: {
                show: false,
                data: {}
            },
            // 来源tab 0 待审核  1  信息变更
            auditType: '',
            // 初始化一个对象 必须填上所有的字段，以免出现未知bug
            form: {
                logo: '',
                enterpriseName: '',
                outEnterpriseNo: '',
                linkAddr: '',
                linkPerson: '',
                linkPhone: '',
                manageScope: '',
                email: '',
                address: '',
                regionCode: '',
                personnelVo: {},
                certVos: [],
                customerList: []
            },
            rules: {},
            // 审核状态:audit_wait草稿 auditing 待审核 audit_fail审核失败，audit_success审核通过
            audit: {
                auditStatus: 'audit_success',
                auditRemark: ''
            }
        };
    },
    computed: {
        auditStatusImg () {
            let img = '';
            // if (auditStatus === 'audit_success') {
            //     img = imgSuccess;
            // } else if (auditStatus === 'audit_fail') {
            //     img = imgFail;
            // } else if (auditStatus === 'auditing') {
            //     img = imgWait;
            // } else if (auditStatus === 'audit_wait') {
            //     // img = caogao;
            // }
            return img;
        }
    },
    components: {
        BaseInfo,
        CertIssued,
        InvoiceList,
        ReceipList,
        AuthorizedArea,
        // CreateAccount,
        // AddApplication,
        BusinessInfo
    },
    props: {},
    methods: {
        ...mapActions(['getCertRuleData']),
        openDialog () {
            this.enterpriseInfo.show = true;
        },
        // 删除经销商
        delEnterprise () {
            this.$confirm('确认删除该经销商吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.Http(URL.del, {
                    enterpriseDto: {
                        enterpriseNo: this.enterpriseNo
                    }
                }).then(result => {
                    this.$message.success('操作成功');
                    setTimeout(() => {
                        this.goBack();
                    }, 1000);
                });
            });
        },
        // 创建账户
        createAccount () {
            this.add.data = {
                enterpriseName: this.form.enterpriseName,
                agentLevel: this.form.agentLevel,
                outEnterpriseNo: this.form.outEnterpriseNo,
                linkPerson: this.form.linkPerson,
                linkPhone: this.form.linkPhone,
                email: this.form.email
            };
            this.add.show = true;
        },
        // 初始化
        init () {
            // 获取正式企业详情
            this.Http(URL.detail, {
                enterpriseNo: this.enterpriseNo,
                isAduited: this.isAduited || '0'
            }).then(results => {
                let data = results.data || {};
                this.form = data;
                this.form.certVos = this.form.certVos.map(
                    item =>
                        // item.certTypeName = Tools.getSelectValue(item.agentLevel, this.certType);
                        item
                );
            });
        },
        goBack () {
            this.removeNav({
                targetName: this.sourceName
            });
        },
        // 检查证照审核 和 基本信息审核是否冲突
        checkValidResult () {
            let result = true,
                certDom = this.$refs.CertIssuedEdit,
                certValid = true;
            certDom.form.certs.forEach(item => {
                item.status === '0' && (certValid = false);
            });
            if (!certValid && this.audit.auditStatus === 'audit_success') {
                result = false;
            }
            return result;
        },
        // 审核
        auditSubmit () {
            let certDom = this.$refs.CertIssuedEdit,
                form = certDom.$refs.certs,
                audit = this.$refs.audit;
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
                                enterpriseNo: this.enterpriseNo,
                                ...this.audit
                            };
                            this.Http(URL.modifyAduit, {
                                params,
                                recordList: certDom.form.certs
                            }).then(results => {
                                this.init();
                                if (
                                    this.auditType === '0' &&
                                    this.audit.auditStatus === 'audit_success'
                                ) {
                                    this.$confirm(
                                        '审核成功，继续为该企业开通应用吗',
                                        '提示',
                                        {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            dangerouslyUseHTMLString: true,
                                            type: 'warning'
                                        }
                                    )
                                        .then(() => {
                                            this.application.data = this.form;
                                            this.application.show = true;
                                        })
                                        .catch(() => {
                                            this.goBack();
                                        });
                                } else {
                                    this.goBack();
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    created () {
        let query = this.$route.query;
        this.enterpriseNo = query.enterpriseNo;
        this.auditType = query.auditType;
        // console.log(this.enterpriseNo);
        this.sourceName = query.sourceName;
        this.isAduited = query.isAduited;
        this.init();
    }
};
</script>
<style scoped lang="scss">
.audit-img {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 222;
}
</style>
