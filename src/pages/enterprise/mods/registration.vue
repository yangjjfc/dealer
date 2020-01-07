<template>
    <section>
        <el-dialog :title="(type === 'add' ? '创建企业': '编辑企业')" :visible.sync="shows" width="1000px" :close-on-click-modal="false">
            <section class="container">
                <el-row>
                    <el-form :model="form" :rules="formRules" ref="form" label-width="150px" size="small">
                        <el-card class="box-card" shadow="never" size="small">
                            <div slot="header" class="clearfix">
                                <span>账户信息</span>
                            </div>
                            <el-col :span="15">
                                <el-form-item label="登录账号" :prop="type==='add'?'loginAccount':''">
                                    <el-input placeholder="请输入登录账号" v-model.trim="form.loginAccount" :disabled="type === 'edit' ? true : false" :minlength="6" :maxlength="20"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="password" v-if="type === 'edit' ? false : true">
                                    <el-input placeholder="请输入密码" v-model.trim="form.password" type="password" :minlength="6" :maxlength="20"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="confirmPassword" v-if="type === 'edit' ? false : true">
                                    <el-input placeholder="请输入密码" v-model.trim="form.confirmPassword" type="password" :minlength="6" :maxlength="20"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号码" :prop="type==='add'?'linkTelphone':''">
                                    <el-input placeholder="请输入手机号" v-model.trim="form.linkTelphone" :minlength="11" :maxlength="11" :disabled="type === 'edit' ? true : false"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-card>
                        <el-card class="box-card" shadow="never">
                            <div slot="header" class="clearfix">
                                <span>企业信息</span>
                            </div>
                            <!-- 企业类型选择 -->
                            <el-form-item label="" prop="enterpriseTypes" class="text-center container">
                                <el-checkbox-group v-model="form.enterpriseTypes" @change="changeEnterpriseTypes" class="mgr10 inline-block" size="medium">
                                    <el-checkbox border label="cs" key="cs" :disabled="form.enterpriseTypes.length===1 && form.enterpriseTypes.join(',').includes('cs')">厂商</el-checkbox>
                                    <el-checkbox border label="jxs" key="jxs" :disabled="form.enterpriseTypes.length===1 && form.enterpriseTypes.join(',').includes('jxs')">经销商</el-checkbox>
                                </el-checkbox-group>
                                <el-checkbox-group v-model="form.hospitalTypes" @change="changeHospitalTypes" class="inline-block" size="medium">
                                    <el-checkbox size="small" border label="yy" key="yy" :disabled="form.hospitalTypes.length===1">医疗机构</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-row>
                                <el-col :span="15">
                                    <el-form-item :label="form.hospitalTypes.length===1 ? '机构名称：' : '企业名称：'" prop="enterpriseName">
                                        <el-input v-model.trim="form.enterpriseName" :maxlength="120"></el-input>
                                    </el-form-item>
                                    <el-form-item label="机构性质：" prop="hospitalType" v-if="form.hospitalTypes.length===1">
                                        <el-select v-model="form.hospitalType" placeholder="请选择" @change="selectHospitalType">
                                            <el-option v-for="item in hospitalTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="法人代表：" prop="legalPerson">
                                        <el-input v-model.trim="form.legalPerson" :minlength="2" :maxlength="50"></el-input>
                                    </el-form-item>
                                    <el-form-item label="注册地址：" prop="address">
                                        <yl-region-picker :codes.sync="form.regionCode"  @input="getAreaName"></yl-region-picker>
                                        <el-input v-model.trim="form.address" :minlength="2" :maxlength="120"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系人：" prop="linkPerson">
                                        <el-input v-model.trim="form.linkPerson" :minlength="2" :maxlength="50"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系人电话：" prop="linkPhone">
                                        <el-input v-model.trim="form.linkPhone" :minlength="2" :maxlength="20"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱：" prop="email">
                                        <el-input v-model.trim="form.email" :minlength="2" :maxlength="60"></el-input>
                                    </el-form-item>
                                    <el-form-item label="经营范围：" prop="manageScope" v-show="form.enterpriseType!=='yy' && form.hospitalTypes.length!==1">
                                        <el-input type="textarea" v-model="form.manageScope" :rows="5" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">&nbsp;</el-col>
                                <el-col :span="8" v-show="form.enterpriseType!=='yy' && form.hospitalTypes.length!==1">
                                    <h3 class="mg10 mgt20 mgb20">经营范围明细：</h3>
                                    <div class="manageScope-tree">
                                        <ul>
                                            <li v-for="(item, index) in categorySelectedData" :key="index">{{item.categoryName}}</li>
                                        </ul>
                                    </div>
                                    <el-button type="primary" @click="tree.show=true" size="small">{{categorySelectedData.length == 0 ? '添加' : '修改'}}经营范围</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-card class="box-card" shadow="never" v-for="(item, index) in form.certVos" :key="item.certType">
                            <div slot="header" class="clearfix">
                                <span>{{item.certTypeName}}</span>
                            </div>
                            <div>
                                <el-form-item :label="item.certIssuedNoName + '：'" v-if="item.isNeedCertIssuedNo==1" :rules="certRules.certCode" :prop="'certVos.'+index+'.certCode'">
                                    <el-input v-model="item.certCode" :minlength="2" :maxlength="50"></el-input>
                                </el-form-item>
                                <el-form-item label="有效期：" required>
                                    <el-col :span="9">
                                        <el-form-item v-if="item.isNeedStartTime==1" :rules="certRules.startTime" :prop="'certVos.'+index+'.startTime'">
                                            <el-date-picker type="date" value-format="yyyy-MM-dd" :placeholder="'选择' + item.startTimeName" v-model="item.startTime" style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="text-center" :span="2" v-if="item.isNeedStartTime==1 && item.isNeedEndTime==1">-</el-col>
                                    <el-col :span="9">
                                        <el-form-item v-if="item.isNeedEndTime==1" :rules="certRules.endTime" :prop="'certVos.'+index+'.endTime'">
                                            <el-date-picker type="date" value-format="yyyy-MM-dd" :placeholder="'选择' + item.endTimeName" v-model="item.endTime" style="width: 100%;" :disabled="item.longTerm === '1'"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col class="text-center" :span="4">
                                        <el-checkbox v-model="item.longTerm" v-if="item.isNeedLong" @change="checkLongTerm(item, index)" true-label="1" false-label="0">长期</el-checkbox>
                                    </el-col>
                                </el-form-item>
                            </div>
                            <el-form-item label="证照图片：" :rules="certRules.certImg" :prop="'certVos.'+index+'.certImg'">
                                <yl-file-upload v-model="item.certImg" :max="item.fileMaxCount"></yl-file-upload>
                                <div slot="tip" class="el-upload__tip">支持jpg,bmp,gif,png,pdf,文件大小不超过5MB</div>
                            </el-form-item>
                        </el-card>
                    </el-form>
                    <!-- <el-col :span="24" class="colspan" v-if="auditStatus=='audit_fail'">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="title">审核失败原因</span>
                        </div>
                        <div>
                            <el-alert :title="form.auditRemark" type="error"></el-alert>
                        </div>
                    </el-card>
                </el-col> -->
                </el-row>
                <category-tree v-if="tree.show" :show.sync="tree.show" :selectedData="categorySelectedData" @getSelectedData="getCategoryTree"></category-tree>
            </section>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitTemporaryForm('form')" size="small" v-if="auditStatus!=='audit_fail'">保存草稿</el-button>
                <el-button type="primary" @click="submitForm('form')" size="small">注 册</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>

import { Tools, emitter } from 'ycloud-ui';
import { mapGetters, mapActions } from 'vuex';
import CategoryTree from './category-tree.vue';
// import imgFail from '@/assets/images/stamp_fail.png';

const URL = {
    CERT_RULE_LIST: 'sdc.certRule.findList',
    PERFECT_REGISTER: 'scs.ecs.enterprise.perfectRegister',
    ENTERPRISE_DETAIL: 'scs.ecs.enterprise.findEnterpriseDetailByEnterpriseNo',
    createEnterpriseByPt: 'scs.ecs.enterprise.createEnterpriseByPt',
    modifyEnterpriseForSystem: 'scs.ecs.enterprise.modifyEnterpriseForSystem', // 修改注册
    detailByEnterpriseNoForPt: 'scs.ecs.enterprise.findEnterpriseDetailByEnterpriseNoForPtBJ',
    CHECK_NAME: 'ddc.uim.userAccount.check',
    CHECK_PHONE: 'ddc.uim.userAccount.check',
    CHECK_UNION_NAME: 'ddc.ecs.enterprise.checkUnionName'
};
export default {
    mixins: [emitter],
    data () {
        // 密码校验
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (value.length < 6 || value.length > 20) {
                    callback(new Error('支持特殊字符，长度6-20位'));
                } else {
                    if (this.form.confirmPassword !== '') {
                        this.$refs.form.validateField('confirmPassword');
                    }
                    callback();
                }
            }
        };

        // 确认密码
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        let validateLoginAccount = (rule, value, callback) => {
            if (/^(\w+@\w+){1,1}(\.\w+){1,2}$/.test(value)) {
                callback(new Error('登录账号不能是邮箱'));
            } else if (/^([+-]?)\d*\.?\d+$/.test(value)) {
                callback(new Error('登录账号不能是纯数字'));
            } else if (!/^\w{3,20}$/.test(value)) {
                var _limit = '长度为4-20字符';
                if (value.length >= 3 && value.length <= 20) {
                    _limit = '仅支持数字、字母(区分大小写)、下划线“_”';
                } else if (value.length === 0) {
                    _limit = '不能为空';
                }
                callback(new Error('登录账号' + _limit));
            } else {
                callback();
            }
        };

        // 验证开始日期
        var checkStartDate = (rule, value, callback) => {
                var itemIndex = rule.field.match(/\.(\d)\./)[1];
                if (!value) {
                    return callback(new Error('请选择开始日期'));
                } else if (true &&
                this.form.certVos[itemIndex].endTime &&
                value.replace(/-/g) > this.form.certVos[itemIndex].endTime.replace(/-/g)) {
                    return callback(new Error('开始日期不能大于结束日期'));
                } else {
                    callback();
                }
            },
            // 验证结束日期
            checkEndDate = (rule, value, callback) => {
                var itemIndex = rule.field.match(/\.(\d)\./)[1];
                if (this.form.certVos[itemIndex].longTerm === '1') {
                    callback();
                } else {
                    if (!value) {
                        return callback(new Error('请选择结束日期'));
                    } else if (this.form.certVos[itemIndex].startTime &&
                    value.replace(/-/g) < this.form.certVos[itemIndex].startTime.replace(/-/g)) {
                        return callback(new Error('结束日期不能小于开始日期'));
                    } else {
                        callback();
                    }
                }
            };
        return {
            auditStatus: '', // 审核状态
            auditStatusImg: '', // 审核状态图片
            tree: { // 隐藏分类树
                show: false
            },
            categorySelectedData: [], // 选中的分类树数据
            hospitalTypeData: [{ // 医疗机构类型
                label: '公立医院',
                value: 'yy'
            }, {
                label: '私立医院',
                value: 'mbyy'
            }],
            formRules: {
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                loginAccount: [
                    { required: true, min: 6, max: 20, validator: validateLoginAccount, trigger: 'blur' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '该账号已被注册',
                        url: URL.CHECK_NAME,
                        params () {
                            return {
                                reverse: true,
                                loginAccount: this.form.loginAccount
                            };
                        }
                    }
                ],
                linkTelphone: [
                    { required: true, pattern: Tools.regexp.phone, trigger: 'blur', message: '请输入正确的手机号' }, {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '手机号码已存在',
                        url: URL.CHECK_PHONE,
                        params () {
                            return {
                                reverse: true,
                                loginAccount: this.form.linkTelphone
                            };
                        }
                    }
                ],
                enterpriseName: [
                    { required: true, trigger: 'blur', message: '请输入企业名称' },
                    {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '企业名称已存在',
                        url: URL.CHECK_UNION_NAME,
                        params () {
                            return {
                                reverse: true,
                                enterpriseName: this.form.enterpriseName,
                                enterpriseNo: this.form.enterpriseNo || ''
                            };
                        }
                    }
                ],
                legalPerson: [{ required: true, message: '请输入法人代表', trigger: 'blur' }],
                hospitalType: [{ required: true, message: '请选机构性质', trigger: 'change' }],
                address: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
                linkPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
                linkPhone: [{ required: true, pattern: Tools.regexp.tel, trigger: 'blur', message: '电话号码格式不正确' }],
                email: [{ required: false, type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
            },
            certRules: { // 证照验证规则
                certCode: [{ required: true, message: '请输入证号', trigger: 'blur' }],
                startTime: [{ type: 'string', validator: checkStartDate, trigger: ['blur', 'change'] }],
                endTime: [{ type: 'string', validator: checkEndDate, trigger: ['blur', 'change'] }],
                certImg: [{ required: true, message: '图片不能为空', trigger: 'change' }]
            },
            form: {
                name: '',
                email: '',
                regionCode: '',
                confirmPassword: '',
                password: '',
                enterpriseName: '',
                address: '',
                legalRepresentatives: '',
                phone: '',
                enterpriseType: '',
                enterpriseTypes: [], // 默认选中“厂家”
                hospitalType: '',
                hospitalTypes: [],
                certVos: [],
                manageScope: ''
            },
            enterpriseTypeData: [{
                label: '厂商',
                value: 'cs'
            }, {
                label: '经销商',
                value: 'jxs',
                checked: true
            }, {
                label: '医疗机构',
                value: 'yy'
            }],
            enterpriseRuleData: {
                enterpriseName: '企业名称：',
                address: '注册地址：',
                legalPerson: '联系人：',
                linkPhone: '联系人电话：',
                email: '邮箱：'
            },
            certTmpData: [],
            currentTypes: ''
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
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
    created () {
    },
    mounted () {
        if (this.type === 'edit') {
            this.getEnterpriseInfo();
        } else {
            this.initEnterpriseTypes();
        }
    },
    methods: {
        ...mapActions(['getCertRuleData']),
        // 初始化企业类型和医疗机构类型
        initEnterpriseTypes () {
            this.form.enterpriseType = this.form.enterpriseType || 'cs';
            if (this.form.enterpriseType !== 'yy') {
                // 非医疗机构（企业）
                this.form.enterpriseTypes = this.form.enterpriseType.split(',');
                this.changeEnterpriseTypes(this.form.enterpriseTypes);
                this.form.hospitalType = '';
                this.form.hospitalTypes = [];
            } else {
                // 医疗机构，默认选中公立医院
                this.form.enterpriseTypes = [];
                this.form.hospitalType = this.form.hospitalType || 'yy';
                this.form.hospitalTypes = this.form.enterpriseType.split(',');
                this.selectHospitalType(this.form.hospitalType);
            }
        },
        // 修改获取企业信息
        getEnterpriseInfo () {
            this.Http(URL.detailByEnterpriseNoForPt, {
                enterpriseNo: this.dialogData.enterpriseNo
            }).then(results => {
                let rData = JSON.parse(JSON.stringify(results.data));
                this.form = {
                    userAccountVo: rData.userAccountVo,
                    address: rData.address,
                    certVos: rData.certVos,
                    email: rData.email,
                    enterpriseNo: rData.enterpriseNo,
                    enterpriseName: rData.enterpriseName,
                    enterpriseType: rData.enterpriseType,
                    enterpriseTypes: rData.enterpriseTypes || [],
                    hospitalType: rData.hospitalType,
                    hospitalTypes: rData.hospitalTypes || [],
                    legalPerson: rData.legalPerson,
                    legalRepresentatives: rData.legalRepresentatives,
                    linkPerson: rData.linkPerson,
                    linkPhone: rData.linkPhone,
                    manageScope: rData.manageScope,
                    name: rData.name,
                    regionCode: rData.regionCode,
                    regionName: rData.regionName,
                    opRevsion: rData.opRevsion, // 数据版本号
                    scopeList: rData.scopeList || [],
                    auditStatus: rData.auditStatus
                };
                this.form.loginAccount = results.data.userAccountVo.loginAccount;
                this.form.linkTelphone = results.data.userAccountVo.secureMobile;

                this.categorySelectedData = this.form.scopeList;
                this.form.hospitalTypes = this.form.hospitalTypes;
                this.form.enterpriseTypes = this.form.enterpriseTypes;
                this.auditStatus = this.form.auditStatus;
                this.initEnterpriseTypes(); 
            });
        },
        // 获取分类树
        getCategoryTree (data = []) {
            let arr = [];
            data.forEach(value => {
                arr.push({
                    categoryId: value.id,
                    categoryCode: value.code,
                    categoryName: value.textName,
                    categoryType: value.type,
                    parentCategoryId: value.parentId
                });
            });
            this.categorySelectedData = arr;
            this.updateManageScopeTree();
        },
        updateManageScopeTree () {
            let tempArr = [];
            this.categorySelectedData.forEach(value => {
                tempArr.push(value.categoryName);
            });
            this.form.manageScope = tempArr.join(';');
            this.tree.show = false;
        },
        // 选择“长期”
        checkLongTerm (item, index) {
            // this.$set(this.form.certVos[index], 'disableEndDate', item.longTerm);
            this.$set(this.form.certVos[index], 'endTime', '');
        },
        // 证照规则合并去重（切换前暂存证照信息）
        handleCertData (arr1 = [], arr2 = []) {
            arr1 = JSON.parse(JSON.stringify(arr1));
            arr2 = JSON.parse(JSON.stringify(arr2));
            if (arr1.length === 0) {
                return JSON.parse(JSON.stringify(arr2));
            }
            if (arr2.length === 0) {
                return JSON.parse(JSON.stringify(arr1));
            }
            arr1 = arr1.concat(arr2);
            let result = [],
                obj = {};
            for (let i = 0; i < arr1.length; i++) {
                if (!obj[arr1[i].certType]) {
                    result.push(arr1[i]);
                    obj[arr1[i].certType] = true;
                }
            }
            return JSON.parse(JSON.stringify(result));
        },
        // 切换企业类型
        changeEnterpriseTypes (types) {
            if (types.length > 0) {
                this.form.hospitalType = '';
                this.form.hospitalTypes = [];
            }
            this.form.enterpriseType = this.form.enterpriseTypes.join(',');
            this.getCertRules(types);
        },
        // 修改医院类型
        changeHospitalTypes (types) {
            if (typeof types === typeof '') {
                types = [types];
            }
            if (types.length === 1) {
                this.form.enterpriseTypes = [];
            }
            this.form.hospitalType = types.join(',');
            this.selectHospitalType(types.join(','));
        },
        // 选择机构类型
        selectHospitalType (type) {
            this.getCertRules([type]);
        },
        // 证照数据
        getCertRules (types) {
            this.currentTypes = types.join(',');
            if (types.length === 0) {
                this.form.certVos = [];
                return;
            }
            // 暂存数据
            this.certTmpData = this.handleCertData(this.form.certVos, this.certTmpData);
            this.Http(URL.CERT_RULE_LIST, {
                enterpriseTypes: types
            }).then(results => {
                // 获取行业证照规则
                let certRulesData = JSON.parse(JSON.stringify(results.data));
                let ruleData = [];
                certRulesData.forEach((rule, index, arr) => {
                    this.certTmpData.forEach((cert, i) => {
                        if (cert.certType === rule.certType) {
                            ruleData[index] = Object.assign(rule, cert);
                        } else {
                            ruleData[index] = rule;
                        }
                        return cert;
                    });
                    return rule;
                });
                if (this.certTmpData.length === 0) {
                    ruleData = certRulesData;
                }
                ruleData.forEach(value => {
                    value.certCode = value.certCode || '';
                    value.startTime = value.startTime || '';
                    value.endTimeName = value.endTimeName || '';
                    value.longTerm = value.longTerm || '';
                    value.certImg = value.certImg || '';
                    value.pickerOptions_sta = value.pickerOptions_sta || {};
                    value.pickerOptions_end = value.pickerOptions_end || {};
                });
                this.$set(this.form, 'certVos', ruleData);
                if (this.auditStatus === 'audit_fail') {
                    this.auditStatusImg = '';
                    this.form.certVos = this.form.certVos.map(item => {
                        item.certCode = item.certCode || '';
                        item.startTime = item.startTime || '';
                        item.endTimeName = item.endTimeName || '';
                        item.longTerm = item.longTerm || '';
                        item.certImg = item.certImg || '';
                        item.pickerOptions_sta = item.pickerOptions_sta || {};
                        item.pickerOptions_end = item.pickerOptions_end || {};
                        let mark = this.form.auditRecordVoList.filter(data => data.certNo === item.certNo);
                        if (mark.length) {
                            item.auditRemark = mark[0].reason;
                        }
                        return item;
                    });
                }
            });
        },
        // 验证表单
        validateForm (formName) {
            formName = formName || 'enterpriseenterpriseRuleDataForm';
            let flag = false;
            this.$refs[formName].validate((valid) => {
                flag = valid;
            });
            return flag;
        },
        // 处理提交的表单数据
        handleSubmitData () {
            let formDto = {};
            Object.assign(formDto, this.form);
            // 证照
            let certVos = [];
            formDto.certVos.forEach(cert => {
                let certImg = cert.certImg;
                if (certImg instanceof Array) {
                    certImg = certImg.join(';');
                }
                certVos.push({
                    certNo: cert.certNo,
                    certImg: certImg,
                    certType: cert.certType,
                    longTerm: cert.longTerm || '0',
                    certCode: cert.certCode,
                    certName: cert.certTypeName,
                    startTime: cert.startTime,
                    // remark: cert.remark,
                    endTime: cert.endTime
                });
            });
            
            // 经营范围
            let scopeList = JSON.parse(JSON.stringify(this.categorySelectedData));
            scopeList.forEach(value => {
                value.productType = '1';
            });

            // 企业类型（医疗单位）
            let enterpriseType = this.form.hospitalTypes.join(',') || this.form.enterpriseTypes.join(',');

            let enterpriseDto = {
                registerSource: 3,
                enterpriseNo: this.form.enterpriseNo,
                enterpriseType: enterpriseType, // 企业类型
                hospitalType: this.form.hospitalType, // 医院类型
                enterpriseName: this.form.enterpriseName, // 企业名称
                legalPerson: this.form.legalPerson, // 法定代表人
                linkPerson: this.form.linkPerson, // 联系人
                linkPhone: this.form.linkPhone, // 联系电话
                regionCode: this.form.regionCode, // 地区编码
                regionName: this.form.regionName, // 地区全称
                address: this.form.address, // 注册地址
                opRevsion: this.form.opRevsion, // 数据版本号
                email: this.form.email, // 企业邮箱
                certs: certVos
            };
            if (enterpriseType !== 'yy') {
                enterpriseDto.scopeList = scopeList;
                delete (enterpriseDto.hospitalType);
            }
            return enterpriseDto;
        },
        // 草稿
        submitTemporaryForm () {
            let requestURL = '';
            let requestParams = {};
            let enterpriseDto = this.handleSubmitData();
            let registerDto = {
                loginAccount: this.form.loginAccount,
                linkTelphone: this.form.linkTelphone,
                password: this.form.password ? Tools.encryption(this.form.password, this.userInfo.clientId, this.userInfo.token) : '',
                confirmPassword: this.form.confirmPassword ? Tools.encryption(this.form.confirmPassword, this.userInfo.clientId, this.userInfo.token) : ''
            };
            enterpriseDto.submitType = 'temporary';

            if (this.type === 'add') {
                requestParams = {
                    enterpriseDto: enterpriseDto,
                    registerDto: registerDto
                };
                requestURL = URL.createEnterpriseByPt;
            } else {
                requestURL = URL.modifyEnterpriseForSystem;
                requestParams = {
                    enterpriseDto: enterpriseDto
                };
            }

            this.Http(requestURL, requestParams).then(results => {
                this.$message({
                    title: '提示信息',
                    message: '保存成功',
                    type: 'success'
                });
                this.shows = false;
                this.$emit('change');
                // this.form.opRevsion = results.data.opRevsion;
            }).catch(errors => {
                this.$message({
                    title: '错误信息',
                    message: errors.message,
                    type: 'error'
                });
            });
        },
        // 提交审核
        async submitForm (formName) {
            if (this.validating) {
                await this.validating;
            }
            let requestURL = '';
            let requestParams = {};
            let enterpriseDto = this.handleSubmitData();
            let registerDto = {
                loginAccount: this.form.loginAccount,
                linkTelphone: this.form.linkTelphone,
                password: this.form.password ? Tools.encryption(this.form.password, this.userInfo.clientId, this.userInfo.token) : '',
                confirmPassword: this.form.confirmPassword ? Tools.encryption(this.form.confirmPassword, this.userInfo.clientId, this.userInfo.token) : ''
            };
            enterpriseDto.submitType = 'submission';

            if (this.type === 'add') {
                requestParams = {
                    enterpriseDto: enterpriseDto,
                    registerDto: registerDto
                };
                requestURL = URL.createEnterpriseByPt;
            } else {
                requestURL = URL.modifyEnterpriseForSystem;
                requestParams = {
                    enterpriseDto: enterpriseDto
                };
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.Http(requestURL, requestParams).then(results => {
                        this.$message({
                            title: '提示信息',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.shows = false;
                        this.$emit('change');
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    return false;
                }
            });
        },
      
        getAreaName (val) {
            this.form.regionName = val;
        }
    },
    watch: {
        categorySelectedData (newValue, oldValue) {
            this.updateManageScopeTree();
        }
    },
    components: {
        CategoryTree
    },
    computed: {
        ...mapGetters(['userInfo', 'routers']),
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
<style scoped>
.manageScope-tree {
    height: 380px; margin-bottom: 12px; overflow: auto; border: 1px solid #ccc;
}
.manageScope-tree li {
    border-bottom: 1px solid #eee; padding: 4px;
}
::v-deep.inline-block {
    display: inline-block;
}
::v-deep.box-card {
    margin-bottom: 20px;
}

::v-deep.audit-status {
    position: absolute;
    width: 128px;
    height: 106px;
    z-index: 1;
    right: 8px;
    backgroun: red;
    top: -17px;
}

::v-deep.colspan {
    margin-bottom: 30px;
}

::v-deep.center {
    text-align: center;
}

::v-deep.region-picker .el-select {
    width: 32%;
}

::v-deep.region-picker .province-select {
    margin-right: 2%;
}

::v-deep.region-picker .city-select {
    margin-right: 2%;
}
::v-deep.container .el-checkbox.is-bordered.is-disabled {
    cursor: default;
    border-color: #03a8ae;
}
::v-deep.container .el-checkbox__input.is-disabled .el-checkbox__inner {
    cursor: default;
}
::v-deep.container .el-checkbox__input.is-disabled .el-checkbox__inner::after {
    cursor: default;
    border-color: #fff;
}
::v-deep.container .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #03a8ae;
    border-color: #03a8ae;
}
::v-deep.container .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #03a8ae;
    cursor: default;
}
</style>
