<template>
    <section>
        <el-dialog :title="(type === 'view' ? '查看企业信息': '审核企业信息')" :close-on-click-modal="false" :visible.sync="shows" :width="(type === 'edit' && tabType === 'change') ? '1100px' : '800px'" @submit="submitForm" classx="mydialog">
            <el-tabs v-model="activeTabDialog" class="enterprise-tab" @tab-click="handleClickDialog" v-if="tabType === 'all' && type === 'viewHistory' ? true : false">
                <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabData" :key="item.index"></el-tab-pane>
            </el-tabs>
            <div class="yl-info" v-loading="isLoading">
                <el-row>
                    <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                        <h2 class="change-title">变更前</h2>
                    </el-col>
                    <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                        <h2 v-if="(type === 'edit' && tabType === 'change') ? true : false" class="change-title">当前变更审核</h2>
                    </el-col>
                </el-row>
                <el-form ref="dialogForm" :model="formData" label-width="150px" label-suffix="：" :rules="rules" status-icon>
                    <div class="enterprise-card">
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <div class="yl-info-tt">
                                    <h3 >企业信息</h3>
                                </div>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <div class="yl-info-tt">
                                    <h3 >企业信息</h3>
                                    <el-tag v-if="type === 'view' || type === 'viewHistory' ? true : false" class="badge" :type="formData.auditStatus == 'audit_fail' ? 'danger' : formData.auditStatus == 'audit_success' ? 'success' : 'warning'">{{ formData.auditStatusName }}</el-tag>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="企业类型" prop="enterpriseType">
                                    {{formDataOld.enterpriseTypeName}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="企业类型" prop="enterpriseType">
                                    {{dialogData.enterpriseTypeName}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="机构性质" prop="hospitalType" v-if="formDataOld.enterpriseType == 'yy' ? true : false">
                                    {{formDataOld.hospitalType == 'mbyy' ? '民办医院' : '公立医院'}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="机构性质" prop="hospitalType" v-if="formData.enterpriseType == 'yy' ? true : false">
                                    {{formData.hospitalType == 'mbyy' ? '民办医院' : '公立医院'}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item :label="formDataOld.enterpriseType == 'yy' ? '机构名称' : '企业名称'" prop="enterpriseName" class="enterpriseName">
                                    {{formDataOld.enterpriseName}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item :label="formData.enterpriseType == 'yy' ? '机构名称' : '企业名称'" prop="enterpriseName" :class="(type === 'edit' && tabType === 'change' && formData.enterpriseName != formDataOld.enterpriseName) ? 'red enterpriseName' : 'enterpriseName'">
                                    {{formData.enterpriseName}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="法人代表" prop="legalPerson">
                                    {{formDataOld.legalPerson}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="法人代表" prop="legalPerson" :class="(type === 'edit' && tabType === 'change' && formData.legalPerson != formDataOld.legalPerson) ? 'red' : ''">
                                    {{formData.legalPerson}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="注册地址" prop="regionName">
                                    {{formDataOld.regionName}}{{formDataOld.address}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="注册地址" prop="regionName" :class="(type === 'edit' && tabType === 'change' && formData.regionName != formDataOld.regionName) ? 'red' : ''">
                                    {{formData.regionName}}{{formData.address}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="联系人" prop="linkPerson">
                                    {{formDataOld.linkPerson}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="联系人" prop="linkPerson">
                                    {{formData.linkPerson}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="联系电话" prop="linkPhone">
                                    {{formDataOld.linkPhone}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="联系电话" prop="linkPhone">
                                    {{formData.linkPhone}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="邮箱" prop="email">
                                    {{formDataOld.email}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="邮箱" prop="email">
                                    {{formData.email}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                                <el-form-item label="经营范围" prop="manageScope" class="manage-scope" v-if="formDataOld.enterpriseType == 'yy' ? false : true">
                                    <p class="manage-scope-content">{{formDataOld.manageScope}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                                <el-form-item label="经营范围" prop="manageScope" class="manage-scope" v-if="formData.enterpriseType == 'yy' ? false : true">
                                    <p class="manage-scope-content">{{formData.manageScope}}</p>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 证照 -->
                    <el-row>
                        <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                            <div class="enterprise-card" v-for="(item, index) in formDataOld.certVos" :key="index">
                                <div class="yl-info-tt clearfix">
                                    <h3>{{ item.certName }}</h3>
                                </div>
                                <el-form-item :label="item.certIssuedNoName" prop="certCode">
                                    <span  class="left">{{item.certCode}}</span>
                                </el-form-item>
                                <el-form-item label="许可时间" prop="startTime">
                                    {{item.startTime}} - {{item.longTerm == 1 ? '长期': item.endTime }}
                                </el-form-item>
                                <el-form-item label="证照图片" prop="certImg">
                                    <yl-file-upload v-model="item.certImg" readonly></yl-file-upload>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                            <div class="enterprise-card" v-for="(item, index) in formData.certVos" :key="index">
                                <div class="yl-info-tt clearfix">
                                    <h3>
                                        {{ item.certName }}
                                        <!-- 查看审核失败原因 -->
                                        <el-tag type="danger" size="small" v-if="formData.auditStatus === 'audit_fail' && item.status == 0 && type === 'view' ? true : false" class="fail-reason right">失败原因：{{item.reason}}</el-tag>
                                    </h3>
                                </div>
                                <el-form-item :label="item.certIssuedNoName" prop="certCode">
                                    <span :class="(type === 'edit' && tabType === 'change' && item.isChange) ? 'left red' : 'left'">{{item.certCode}}</span>
                                    <!-- 审核不通过 -->
                                    <div class="left itemCheck" v-if="auditFail">
                                        <el-form-item label="" label-width="10px" :rules="certRules.status" :prop="'certVos.'+index+'.status'" class="has-fail">
                                            <el-radio-group v-model="item.status">
                                                <el-radio label="1">通过</el-radio>
                                                <el-radio label="0">不通过</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="" v-if="item.status === '0'" label-width="10px" :rules="certRules.reason" :prop="'certVos.'+index+'.reason'" class="fail-input">
                                            <el-input size="small" v-model="item.reason" type="textarea" :rows="1" :maxlength="30" placeholder="审核不通过必填"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-form-item>
                                <el-form-item label="许可时间" prop="startTime">
                                    {{item.startTime}} - {{item.longTerm == 1 ? '长期': item.endTime }}
                                </el-form-item>
                                <el-form-item label="证照图片" prop="certImg">
                                    <yl-file-upload v-model="item.certImg" readonly></yl-file-upload>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- 审核 -->
                    <el-row>
                        <el-col :span="12" v-if="(type === 'edit' && tabType === 'change') ? true : false" class="old-info">
                            <div class="enterprise-card">
                                <div class="yl-info-tt">
                                    <h3>审核信息</h3>
                                </div>
                                <el-form-item :class="formDataOld.auditStatus === 'audit_success' ? '' : 'red' " label="" label-width="10px">
                                    {{ formDataOld.auditRemark }}
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="(type === 'edit' && tabType === 'change') ? 12 : 24" class="current-info">
                            <div class="enterprise-card" v-if="type === 'view' || type === 'viewHistory' ? false : true">
                                <div class="yl-info-tt">
                                    <h3>审核信息</h3>
                                </div>
                                <el-form-item label="审核" prop="auditStatus">
                                    <el-radio-group v-model="formData.auditStatus" @change="changeStatus">
                                        <el-radio label="audit_success">通过</el-radio>
                                        <el-radio label="audit_fail">不通过</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="备注" prop="remark">
                                    <el-input class="w300" size="small" v-model="formData.remark" type="textarea" :rows="2" :maxlength="100" placeholder="审核不通过必填"></el-input>
                                </el-form-item>
                            </div>
                            <div class="enterprise-card" v-if="(type === 'view' || type === 'viewHistory') ? true : false">
                                <div class="yl-info-tt">
                                    <h3>审核信息</h3>
                                </div>
                                <el-form-item label="提交时间" prop="operateTime" label-width="100px">
                                    {{ formData.operateTime }}
                                </el-form-item>
                                <el-form-item v-if="formData.auditStatus === 'audit_success' || formData.auditStatus === 'audit_fail' ? true : false " label="审核人" label-width="100px">
                                    {{ formData.auditName }}
                                </el-form-item>
                                <el-form-item v-if="formData.auditStatus === 'audit_success' || formData.auditStatus === 'audit_fail' ? true : false " label="审核时间" label-width="100px">
                                    {{ formData.auditTime }}
                                </el-form-item>
                                <el-form-item v-if="formData.auditStatus === 'audit_success' || formData.auditStatus === 'audit_fail' ? true : false " :class="formData.auditStatus === 'audit_fail' ? 'red' : '' " label="审核原因" label-width="100px">
                                    {{ formData.auditRemark }}
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submitForm('form')" v-if="type === 'view' || type === 'viewHistory' ? false : true">审 核</el-button>
                <el-button size="small" @click="shows = false">关 闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import commonMix from '@/utils/mixins/commonMix.js';
const URL = {
    audit: 'scs.ecs.enterprise.auditChange',
    view: 'ddc.ecs.enterprise.getHaveRev',
    allViewHistory: 'ddc.ecs.enterprise.findRevList',
    allViewSingle: 'ddc.ecs.enterprise.get'
};
let enterpriseType = [{
    value: 'cs',
    label: '厂商'
}, {
    value: 'jxs',
    label: '经销商'
}, {
    value: 'yy',
    label: '医院'
}];
export default {
    mixins: [commonMix],
    data () {
        // 验证总体备注
        var checkAll = (rule, value, callback) => {
                if (this.formData.auditStatus === 'audit_fail') {
                    if (!value) {
                        return callback(new Error('请填写不通过原因'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            // 验证单个备注
            checkItem = (rule, value, callback) => {
                console.log(rule);
                var itemIndex = rule.field.match(/\.(\d)\./)[1];
                console.log(itemIndex);
                console.log(this.formData.certVos[itemIndex].status);
                if (this.formData.certVos[itemIndex].status === '1') {
                    callback();
                } else {
                    if (!value) {
                        return callback(new Error('请填写不通过原因'));
                    } else {
                        callback();
                    }
                }
            };

        return {
            activeTabDialog: 0,
            tabData: [],
            allTabFormData: [],
            isLoading: false,
            auditFail: false,
            formData: {},
            formDataOld: {},
            currentURL: '',
            certRules: {
                status: [
                    { required: true, trigger: 'blur', message: '请选择审核状态' }
                ],
                reason: [
                    { type: 'string', validator: checkItem, trigger: 'blur' }
                ]
            },
            rules: {
                auditStatus: [
                    { required: true, trigger: 'blur', message: '请选择审核状态' }
                ],
                remark: [
                    { type: 'string', validator: checkAll, trigger: 'blur' }
                ]
            }
        };
    },
    filters: {
        typeFilter (str) {
            let result = enterpriseType.filter(item => item.value === str);
            if (result.length) {
                return result[0].label;
            } else {
                return '为匹配' + str;
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        tabType: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'add'
        },
        dialogData: {
            type: Object,
            required: true
        }
    },
    methods: {
        // 获取企业信息
        getEnterpriseInfo () {
            let pageParams = {
                enterpriseNo: this.dialogData.enterpriseNo
            };
            if (this.tabType === 'all' && this.type === 'viewHistory') {
                this.currentURL = URL.allViewHistory;
            } else if (this.tabType === 'all' && this.type === 'view') {
                this.currentURL = URL.allViewSingle;
            } else {
                this.currentURL = URL.view;
                pageParams.isAduited = null;
            }
            this.isLoading = true;
            this.Http(this.currentURL, pageParams).then(res => {
                if (this.tabType === 'all' && this.type === 'viewHistory') {
                    if (res.data.length) {
                        this.allTabFormData = res.data.map((item, index) => {
                            item.certVos = item.certContent ? JSON.parse(item.certContent) : [];
                            item.auditStatus = (item.auditStatus === 'audit_success' || item.auditStatus === 'audit_fail') ? item.auditStatus : null;
                            if (item.auditStatus === 'audit_wait') {
                                item.auditStatusName = '草稿';
                            } else if (item.auditStatus === 'auditing') {
                                item.auditStatusName = '待审核';
                            } else if (item.auditStatus === 'audit_fail') {
                                item.auditStatusName = '审核失败';
                            } else {
                                item.auditStatusName = '审核通过';
                            }
                            if (item.auditRecordVoList) {
                                item.auditRecordVoList.map(item1 => {
                                    item.certVos.find(item2 => {
                                        if (item2.certNo === item1.certNo) {
                                            item2.reason = item1.reason;
                                            item2.status = item1.status;
                                        }
                                    });
                                });
                                /* for (var i = 0; i < item.auditRecordVoList.length; i++) {
                                    for (var j = 0; j < item.certVos.length; j++) {
                                        if (item.auditRecordVoList[i].certNo == item.certVos[j].certNo) {
                                            item.certVos[j].reason = item.auditRecordVoList[i].reason;
                                            item.certVos[j].status = item.auditRecordVoList[i].status;
                                        }
                                    }
                                } */
                            }
                            return item;
                        });
                        for (var i = 0; i < res.data.length; i++) {
                            this.tabData.push({
                                name: i + '',
                                label: res.data[i].operateTime.substr(0, 10)
                                // label: '历史信息' + orderNumber
                            });
                        }
                        this.formData = this.allTabFormData[0];
                    }
                } else {
                    if (this.type === 'edit') {
                        res.data.auditStatus = (res.data.auditStatus === 'audit_success' || res.data.auditStatus === 'audit_fail') ? res.data.auditStatus : null;
                    }
                    res.data.certVos = res.data.certContent ? JSON.parse(res.data.certContent) : [];
                    if (this.type === 'view' && res.data.auditRecordVoList.length && res.data.certVos.length) {
                        res.data.auditRecordVoList.map(item1 => {
                            res.data.certVos.find(item2 => {
                                if (item2.certNo === item1.certNo) {
                                    item2.reason = item1.reason;
                                    item2.status = item1.status;
                                }
                            });
                        });
                        /* for (var j = 0; j < res.data.auditRecordVoList.length; j++) {
                            if (res.data.auditRecordVoList[j].certNo == res.data.certVos[j].certNo) {
                                res.data.certVos[j].reason = res.data.auditRecordVoList[j].reason;
                                res.data.certVos[j].status = res.data.auditRecordVoList[j].status;
                            }
                        } */
                    }
                    if (res.data.auditStatus === 'audit_wait') {
                        res.data.auditStatusName = '草稿';
                    } else if (res.data.auditStatus === 'auditing') {
                        res.data.auditStatusName = '待审核';
                    } else if (res.data.auditStatus === 'audit_fail') {
                        res.data.auditStatusName = '审核失败';
                    } else {
                        res.data.auditStatusName = '审核通过';
                    }
                    if (this.tabType === 'change' && res.data.oldEnterprise) {
                        res.data.oldEnterprise.certVos = res.data.oldEnterprise.certContent ? JSON.parse(res.data.oldEnterprise.certContent) : [];
                        this.formDataOld = res.data.oldEnterprise;
                        console.log(res.data.certVos);
                        console.log(res.data.oldEnterprise.certVos);
                        if (res.data.certVos.length && res.data.oldEnterprise.certVos.length) {
                            res.data.certVos.map(item1 => {
                                res.data.oldEnterprise.certVos.find(item2 => {
                                    if (item1.certType === item2.certType && item1.certCode !== item2.certCode) {
                                        item1.isChange = true;
                                    }
                                });
                            });
                        }
                    }
                    this.formData = res.data;
                }

                this.isLoading = false;
            });
        },

        // 有tab的时候切换tab
        handleClickDialog (e) {
            this.formData = this.allTabFormData[e.name];
        },

        // 选择审核状态
        changeStatus (e) {
            this.auditFail = e === 'audit_fail';
        },

        // 审核
        async submitForm () {
            let curUrl = this.$route.path;
            let newUrl = curUrl.replace(/enterprise.*/, 'enterprise/open');
            if (this.validating) {
                await this.validating;
            }
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    let params = {}; // ...this.formData
                    params.remark = this.formData.remark ? this.formData.remark : '';
                    params.auditRecords = this.formData.certVos ? this.formData.certVos : [];
                    params.status = this.formData.auditStatus;
                    params.enterpriseNo = this.formData.enterpriseNo;
                    console.log(params);
                    this.Http(URL.audit, params).then((res) => {
                        this.$message({
                            message: '审核成功',
                            type: 'success'
                        });
                        this.shows = false;
                        this.$emit('change');
                        // 跳转开通应用
                        if (this.tabType === 'audit' && params.status === 'audit_success') {
                            this.$alert('企业审核成功，即将跳转开通企业应用<br />3秒后跳转', '提示信息', {
                                confirmButtonText: '去开通应用',
                                customClass: 'enterpriseNo-open',
                                dangerouslyUseHTMLString: true,
                                callback: action => {
                                    this.$router.push({
                                        path: newUrl,
                                        params: {
                                            enterpriseNo: this.formData.enterpriseNo
                                        },
                                        query: {
                                            enterpriseNo: this.formData.enterpriseNo
                                        }
                                    });
                                }
                            });
                            // 3秒钟后跳转
                            setTimeout(() => {
                                document.querySelector('.enterpriseNo-open .el-button').click();
                            }, 3000);
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    },
    created () {
        this.getEnterpriseInfo();
    },
    mounted () {

    },
    computed: {
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
<style lang="scss" rel="stylesheet/scss" scoped>
::v-deep.itemCheck .el-form-item--small.el-form-item {
    margin-bottom: 0;
}

.yl-info ::v-deep .el-form-item {
    margin-bottom: 0;
        border-bottom: 1px solid #ebeef5;
    width: auto;
}

.change-time {
    margin-bottom: 5px;
    color: #999;
}

.change-title {
    background-color: #f9f9f9;
    border-bottom: 1px solid #ebeef5;
    color: #666;
    padding: 10px;
    font-size: 18px;
    font-weight: 700;
}

.enterprise-tab {
    margin: 0 0 15px;
}

.yl-info-tt {
    position: relative
}

.yl-info .reason {
    color: #f00;
}

.yl-info .badge {
    position: absolute;
    right: 0px;
    top: -6px;
    padding: 0 15px;
    font-size: 16px;
    height: 34px;
    line-height: 34px;
    border-radius: 3px 0 0 3px;
    background-color: #67c23a;
    color: #fff;
}

::v-deep.yl-info .badge.el-tag--warning {
    background-color: #e6a23c;
}

::v-deep.yl-info .badge.el-tag--danger {
    background-color: #f56c6c;
}

.red {
    color: #f00;
}

::v-deep.red .el-form-item__label,
::v-deep.red .el-form-item__content {
    color: #f00;
}

::v-deep.manage-scope .el-form-item__content {
    height: 80px;
    overflow-y: auto;
}

.enterpriseName {
    word-wrap: break-word;
}

.old-info {
    border-right: 1px solid #ebeef5;
    min-height: 1px;
}

.current-info {
    border-left: 1px solid #ebeef5;
    min-height: 1px;
    margin-left: -1px;

}

.manage-scope-content {
    padding: 8px 5px 0 0;
    line-height: 24px;
}

::v-deep.has-fail {
    float: left;
}

::v-deep.has-fail .el-radio+.el-radio {
    margin-left: 10px;
}

::v-deep.fail-input {
    float: left;
    width: 150px !important;
}

</style>
