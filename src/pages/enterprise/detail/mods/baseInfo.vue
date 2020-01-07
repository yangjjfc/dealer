<template>
    <section class="yl-info">
        <!--<el-form size="small" :model="form" label-suffix="：" label-width="120px" >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="经销商名称">
                        <p v-text="form.enterpriseName"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经销商编号">
                        <p v-text="form.enterpriseNo"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <p v-text="form.linkPerson"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码">
                        <p v-text="form.linkPhone"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="邮编">
                        <p v-text="form.email"></p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>-->
        <div class="yl-info-tt">
            <h3>基本信息</h3>
        </div>
        <el-form size="small" :model="form" label-suffix="：" label-width="120px" >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="企业名称">
                        <p v-text="form.enterpriseName"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="企业地址">
                        <p>
                            {{form.regionName}}{{form.address}}
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="统一社会信用代码">
                        <p v-text="form.creditCode"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="成立日期">
                        <p v-text="form.establishmentDate"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="注册资金">
                        <p>
                            {{form.capital}} 万
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经营许可证编码">
                        <p >{{form.businessPermitCode  }}</p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="注册日期">
                        <p v-text="form.regStartTime"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="到期日期">
                        <p >
                            {{form.regLongTerm == 1 ? '长期' :form.regEndTime}}
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="法定代表人">
                        <p v-text="form.legalPerson"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="职务">
                        <p v-text="form.position"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话">
                        <p v-text="form.legalPhone"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务联系人">
                        <p v-text="form.linkPerson"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="职位">
                        <p v-text="form.linkPosition"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话">
                        <p v-text="form.linkPhone"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="公司固定电话">
                        <p v-text="form.fixedPhone"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="传真">
                        <p v-text="form.fax"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="邮政编码">
                        <p v-text="form.zipCode"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="办公场所">
                        <p>
                            {{ form.officeType == '1' ? '自有': form.officeType == '2' ? '租赁' : '未设置'}}
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="期限">
                        <p>{{form.officeStartTime}} {{form.officeEndTime ? '- ' + form.officeEndTime : '' }}</p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="yl-info-tt">
            <h3>业务信息</h3>
        </div>
        <el-form size="small" :model="form" label-suffix="：" label-width="120px" >
            <el-row>
                <el-col :span="24">
                    <el-form-item label="经营产品">
                        <el-table :data="form.agentList">
                            <el-table-column prop="agentBrand" label="代理品牌"></el-table-column>
                            <el-table-column prop="agentProduce" label="代理产品"></el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上年度总营业额">
                        <p >
                            {{form.lastyearAmount}} 万
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上年度代理亚辉龙产品销售额" label-width="200px">
                        <p >
                            {{form.lastyearYhloAmount}} 万
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="重要直销客户">
                        <el-table :data="form.customerList">
                            <el-table-column prop="customerName" label="医院名称"></el-table-column>
                            <el-table-column prop="addr" label="地址"></el-table-column>
                            <el-table-column prop="department" label="科室"></el-table-column>
                            <el-table-column prop="linkPerson" label="联系人"></el-table-column>
                            <el-table-column prop="linkPhone" label="联系方式"></el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="仓库情况">
                        <p>
                            {{ form.housewareType == '1' ? '自有': form.housewareType == '2' ? '租赁' : '未设置'}}
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="面积">
                        <p v-text="form.housewareArea"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="期限">
                        <p>{{form.housewareStartTime}} {{form.housewareEndTime ? '- ' + form.housewareEndTime : '' }}</p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否具有售后服务的能力" label-width="200px">
                        <p>
                            {{form.afterSale == '1' ? '是' : '否'}}
                        </p>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="售后服务人数">
                        <p v-text="form.afterSaleNum"></p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="yl-info-tt">
            <h3>人员信息</h3>
        </div>
        <el-form size="small" :model="form" label-suffix="：" label-width="120px" >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="总人数">
                        <p v-text="form.personNum"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务员数量">
                        <p v-text="form.businessNum"></p>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="技术人员数量">
                        <p v-text="form.technicianNum"></p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-table :data="form.userList">
                <el-table-column prop="personName" label="姓名"></el-table-column>
                <el-table-column prop="job" label="职务"></el-table-column>
                <el-table-column prop="" label="性别">
                    <template slot-scope="scope">
                        {{scope.row.sex == '1' ? '男' : '女'}}
                    </template>
                </el-table-column>
                <el-table-column prop="qualification" label="学历"></el-table-column>
                <el-table-column prop="speciality" label="专业"></el-table-column>
                <el-table-column prop="professional" label="职称"></el-table-column>
                <el-table-column prop="jobTime" label="从事医疗器械行业时间"></el-table-column>
            </el-table>
        </el-form>
        <div v-if="form.auditStatus === 'audit_fail' ">
            <div class="yl-info-tt">
                <h3>审核失败原因</h3>
            </div>
            <el-form size="small" :model="form" label-suffix="：" label-width="120px" >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="审核失败原因">
                            <p v-text="form.auditRemark"></p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核人">
                            <p v-text="form.auditName"></p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核时间">
                            <p v-text="form.auditTime"></p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </section>
</template>
<style lang="scss" scoped>
::v-deep.tab-new {
    margin-left: 66px;
    top: 12px;
}

.yl-info .yl-info-con h3,
.yl-info .yl-info-con .tt {
    width: 120px;
}

</style>
<script>
export default {
    data () {
        return {
            userList: []
        };
    },
    props: {
        form: {
            type: Object,
            required: true
        }
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
    },
    components: {
        // EnterpriseUpdate
    },
    created () {
    },
    mounted () {},
    methods: {

    }
};

</script>
