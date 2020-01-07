<template>
    <el-form label-width="130px" size="small" :model="form" ref="certs" label-suffix="：">
        <el-row :gutter="15">
            <el-col :span="12" v-for="(item, index) in form.certs" :key="index" :style="{clear: index % 2 == 0 ? 'both' : none}">
                <el-card class="box-card mgb10" shadow="never">
                    <div slot="header" class="clearfix">
                        <span class="title">{{item.certName}}</span>
                    </div>

                    <el-form-item label="证号">
                        <p v-text="item.certCode"></p>
                    </el-form-item>
                    <el-form-item label="许可日期" v-if="item.isNeedStartTime">
                        <el-col :span="9">
                            <el-form-item v-if="item.isNeedStartTime">
                                <span v-text="item.startTime"></span>
                                <span v-if="item.isNeedStartTime && item.isNeedEndTime"> - </span>
                                <span>
                                    {{item.longTerm == 1 ? '长期': item.endTime }}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="证照图片">
                        <FilePreview :files="item.certImg"></FilePreview>
                    </el-form-item>
                    <template v-if="isAudit">
                        <el-form-item label="审核结果">
                            <el-radio v-model="item.status" label="1">成功</el-radio>
                            <el-radio v-model="item.status" label="0">失败</el-radio>
                        </el-form-item>
                        <el-form-item label="原因" :prop="'certs.' + index + '.reason' "
                                      :rules="{ required: item.status == '0', message: '原因不能为空', trigger: 'blur'}"
                        >
                            <el-input v-model="item.reason"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="审核结果">
                            <p class="text-success" v-if="item.auditStatus == '1'">审核成功</p>
                            <p class="text-danger" v-else>审核失败</p>
                        </el-form-item>
                        <el-form-item label="审核备注">
                            <p >
                                {{item.remark || '暂无'}}
                            </p>
                        </el-form-item>
                    </template>
                </el-card>
            </el-col>
        </el-row>
        <el-alert type="info" title="经销商未上传证照" v-if="list.length == 0" :closable="false"></el-alert>
    </el-form>
</template>

<script>
// import BASE from '@/utils/constant/index.js';
export default {
    name: 'certIssued',
    data () {
        return {
            // cert_type  cert_name
            form: {
                certs: []
                // certs: JSON.parse(JSON.stringify(BASE.certs))
            }
        };
    },
    props: {
        list: {
            type: Array
        },
        isAudit: {
            type: Boolean
        }
    },
    watch: {
        list (val) {
            this.mixinsCert(val);
        }
    },
    methods: {
        mixinsCert (val) {
            this.form.certs.forEach(item => {
                let data = val.filter(data => data.certType === item.certType);
                if (data.length) {
                    Object.assign(item, data[0]);
                }
            });
        }
    }
};
</script>

<style scoped>
    .box-card {
        height: 400px;
    }
</style>
